# AGENTS.md – lhi_trainig (CAP Academy training project)

Context for everyone working on this repo: developers, trainers and AI coding agents.
Read this before changing code. Keep it up to date when you change architecture, conventions or open issues.

## Purpose

Training project for a **SAP BTP CAP Academy**. The code is teaching material, so it should show
**idiomatic, documented** CAP and UI5 patterns that students can look up in the official docs.
If you have to choose between a clever workaround and the documented standard, use the standard.

## Reference documentation (source of truth)

| Topic | Link |
|---|---|
| CAP (CDS, Node.js runtime, HANA, deployment) | https://cap.cloud.sap/docs/ |
| SAPUI5 / Fiori elements (frontend) | https://ui5.sap.com/ |

Useful CAP chapters: [CDS language](https://cap.cloud.sap/docs/cds/cdl) ·
[Calculated elements](https://cap.cloud.sap/docs/cds/cdl#calculated-elements) ·
[Node.js services & handlers](https://cap.cloud.sap/docs/node.js/core-services) ·
[CSV initial data](https://cap.cloud.sap/docs/guides/databases#providing-initial-data) ·
[SAP HANA](https://cap.cloud.sap/docs/guides/databases-hana) ·
[Authorization](https://cap.cloud.sap/docs/guides/security/authorization) ·
[Deployment to CF](https://cap.cloud.sap/docs/guides/deployment/to-cf)

## Stack

| Layer | Technology |
|---|---|
| Backend | CAP Node.js, `@sap/cds` 9 (`srv/`) |
| DB (production) | SAP HANA Cloud via `@cap-js/hana` (HDI container `trainig-db`) |
| DB (local dev) | SQLite in-memory via `@cap-js/sqlite`, filled from CSV in `db/data/` |
| Protocols | OData V4 (`/odata/v4/...`) + OData V2 via `@cap-js-community/odata-v2-adapter` (`/odata/v2/...`) |
| Frontend | SAPUI5 – Fiori elements (List Report / Object Page) and freestyle apps in `app/` |
| Deployment | MTA (`mta.yaml`) to SAP BTP Cloud Foundry: XSUAA, HTML5 repo, destination service |

No `cds` configuration in `package.json` (`"cds": {}`). CAP defaults apply:
SQLite + mocked auth in development, HANA + `jwt` (XSUAA) auth in production.

## Project layout

```
db/schema.cds            data model (namespace db)
db/data/db-<Entity>.csv  initial data (file name = <namespace>-<Entity>.csv)
db/undeploy.json         HDI undeploy list
srv/cat-service.cds      MotocycleService + BestellungenService
srv/cat-service.js       implementation of MotocycleService (class-based)
srv/server.js            custom server.js (empty bootstrap hook, kept as a teaching skeleton)
app/<app>/               UI5 apps, each with its own annotations.cds, manifest.json, ui5.yaml
app/services.cds         pulls the apps' annotations.cds into the model
mta.yaml, xs-security.json   BTP deployment and XSUAA config
```

## Commands

```bash
npm install --no-package-lock   # see "Open issues": npm ci fails at the moment
cds watch                        # http://localhost:4004, SQLite in-memory + CSV, mocked users (alice, bob, ...)
npm run watch-motocycle_fcl      # starts cds watch and opens one specific app (see package.json scripts)
cds compile db srv --to sql --dialect hana   # check the HANA DDL without deploying
npm run build && npm run deploy  # mbt build + cf deploy
```

Local requests need a mocked user, e.g. `curl -u alice: http://localhost:4004/odata/v4/motocycle/Motocycle`.

## Data model (`db/schema.cds`)

All entities use the aspect `primary : cuid` (UUID key `ID`). Domain names are **German**; keep them German.

| Entity | Key fields / notes |
|---|---|
| `Kunden` | `vorname`, `nachname`, `land : Country`, `stadt` |
| `Bestellungen` | `bestellungs_id : Int32`, `bestell_datum : Date`, `gesamt_summe : Decimal(9,2)`, `kunde → Kunden` |
| `Company` | `name`, `land : Country` |
| `Motocycle` | `name`, `typ`, `hubraum`, `farbe`, `jahr`, `preis : Decimal(9,2)`, `discount` (percent), `hasDiscount`, `company → Company`, technical data (see below), **`discountPrice`** (calculated, see below) |

`Motocycle` technical data (added 2026-10-12): `leistung_ps`, `leistung_kw`, `drehmoment_nm`, `zylinder`, `motorbauart`,
`kuehlung`, `getriebe_gaenge`, `antrieb` (Kette/Kardan/Riemen), `gewicht_kg` (wet weight), `tankinhalt_l : Decimal(4,1)`, `sitzhoehe_mm`,
`hoechstgeschwindigkeit_kmh`, `fuehrerscheinklasse` (A/A2/A1), `beschreibung` (German, 1–2 sentences), `quelle_url` (data source).

### Initial data (`db/data/`)

- **Company**: BMW `…042a`, Yamaha `…042b`, Ducati `…042c`, Honda `…042d`.
- **Motocycle**: 28 rows.
  - IDs `…0421`–`…0424` are the original training rows (GSA, Tenere, R1, Monster). Keep their first 10 columns unchanged, because exercises may reference them.
  - IDs `…1001`–`…1024` are real models: BMW `1001–1008`, Honda `1009–1016`, Yamaha `1017–1024`. Each brand has 8 models covering the types ADV, Sport, Naked, Touring, Cruiser, Sport-Touring and Enduro, including at least 2 from before 2020.
- **The CSV doesn't go through service handlers**, so CSV rows must follow the discount rule themselves: `jahr < 2020` → `discount 10, hasDiscount true`, otherwise `0, false`.
- How the data was collected: researched on the web by AI agents (Oct 2026) and plausibility-checked (PS↔kW, ccm, licence class). It's teaching data, not an authoritative spec sheet:
  - Prices are German list prices in EUR from different sources (some include delivery costs).
  - `hoechstgeschwindigkeit_kmh` is empty for 5 models with no published value.
  - About 10 colours are plausible but not confirmed by a source.
  - Most `quelle_url` values point to motorradonline.de / motorradundreisen.de, because manufacturer sites couldn't be fetched.
  - Monster (Ducati) has no technical data.

`Motocycle` (without "r") is the established spelling for entities, services, URLs and app names. Don't "fix" it
in only one place, because that would break CSV files, URLs and the apps.

CSV rules: one file per entity named `db-<Entity>.csv`. Associations use the foreign key column (`company_ID`, `kunde_ID`),
`Country` uses `land_code`, dates are ISO `YYYY-MM-DD`.

## Services and business logic (`srv/`)

### `MotocycleService` → `/odata/v4/motocycle` (and `/odata/v2/motocycle`)

Entities `Company`, `Motocycle` (projections on `db`).

| Element | Kind | Behaviour |
|---|---|---|
| `discountPrice` | calculated element in CDS | `case when hasDiscount = true then preis * (100 - discount) / 100.0 else preis end`, computed **by the database** on read. Keep `100.0`: with `100`, SQLite does integer division (17675 → 15907 instead of 15907.5) |
| before `CREATE`/`UPDATE` `Motocycle` | handler | if `jahr` is sent and `< 2020` → `discount = 10`, `hasDiscount = true` |
| `hello()` | function (GET) | returns `"Hello, World!"` |
| `helloAction()` | action (POST) | returns `"Hello, World!"` |
| `getMotocyclesByCompany(companyId)` | function (GET) | returns `array of Motocycle` for the company |
| `getMotocyclesByCompanyAction(companyId)` | action (POST) | same as above, as an action |

Implementation pattern (keep it like this):

```js
class MotocycleService extends cds.ApplicationService {
  init() {
    const { Motocycle } = this.entities;          // service entities, never string names like "db.Motocycle"
    this.before(["CREATE", "UPDATE"], Motocycle, req => { ... });
    this.on([...], req => this.read(Motocycle).where({ company_ID: req.data.companyId }));
    return super.init();
  }
}
module.exports = { MotocycleService };            // CAP picks the class by service name
```

- `module.exports = { MotocycleService }`: CAP looks up `impl[serviceName]`. Services without an entry use the generic
  default implementation, which is how `BestellungenService` runs.
- Use `this.read(...)` inside handlers so queries go through the service, not straight to `cds.db`.

Input validation (`annotate MotocycleService.Motocycle` in `srv/cat-service.cds`,
[CAP docs: Declarative Constraints](https://cap.cloud.sap/docs/guides/services/constraints)):
- `@mandatory`: `name`, `typ`, `hubraum`. Only these three, because every existing Create dialog already sends them.
- `@readonly`: `discount`, `hasDiscount`. Client values are silently dropped, but the before handler still sets them, because CAP's input cleansing runs before custom handlers.
- `@assert.range` on all numeric fields, e.g. `zylinder [1, 8]`, `jahr [1900, 2100]`. `null` is allowed.
- `@assert.format: '^https?://'` on `quelle_url`.
- `discountPrice` is a calculated element, so it's dropped from any write automatically.
- CSV loading bypasses these checks. Keep the CSV values inside the ranges.
- Note on the discount rule: setting `jahr` to 2020 or later on UPDATE does **not** remove an existing discount.

### `BestellungenService` → `/odata/v4/bestellungen`

Entities `Kunde` (on `db.Kunden`) and `Bestellung` (on `db.Bestellungen`). No custom logic, generic CRUD only.

## Frontend (`app/`) – SAPUI5

Reference: **https://ui5.sap.com/** (API reference, Fiori elements V4 docs, SDK samples).

| Folder | App ID | Type | OData | Deployed (mta) |
|---|---|---|---|---|
| `bestellungen_fiori` | `bestellungenfiori` | Fiori elements V4 LROP | V4 `bestellungen` | yes |
| `motocycle_fiori` | `motocyclefiori` | Fiori elements V4 LROP | V4 `motocycle` | yes |
| `motocycle_freestyle` | `motocyclefreestyle` | Freestyle (default model V4, plus `modelV2`, JSON models) | V4 + V2 | yes |
| `motocycle_smart_elements` | `motocyclesmartelements` | Freestyle with smart controls (default model **V2**) | V2 + V4 | yes |
| `motocycle_fcl` | `motocyclefcl` | Freestyle Flexible Column Layout (List/Detail/Company) | V4 + V2 (`products`) | yes |
| `book` | `book` | Fiori elements LROP | V4 `catalog` (**does not exist**, see open issues) | yes |
| `motorcycle_fcl` | `motorcyclefcl` | Older FCL scaffold (only `App` view) | V4 | **no** |

UI5 conventions for this project:
- Modules use `sap.ui.define` / `sap.ui.require` (async AMD). Don't use globals like `sap.m.Button`.
- Manifest first: data sources and models go in `manifest.json`, not in controller code.
- All UI texts go in `i18n/i18n.properties`.
- Use XML views and fragments.
- New code uses the **OData V4 model**. OData V2 (through the adapter) is only for controls that require it, e.g. `sap.ui.comp` smart controls.
- Fiori elements apps are driven by annotations in `app/<app>/annotations.cds`. Every new app's annotations must be
  added to `app/services.cds`. Prefer annotations over controller extensions.
- Keep each app's `minUI5Version` in `manifest.json` consistent with the UI5 version in `ui5.yaml`.
- Calculated or read-only fields such as `discountPrice` must be displayed, never edited.
- Formatters go in `webapp/model/formatter.js` and are exposed on the controller as `formatter: formatter`
  (UI5 walkthrough pattern), e.g. `{parts: [{path: 'detailModel>/hubraum'}, {value: 'ccm'}], formatter: '.formatter.withUnit'}`.
- Put only Label/field pairs and `core:Title` inside a `SimpleForm`. A `MessageStrip` inside a SimpleForm makes the whole
  app render blank **without any error in the console or the UI5 log**. Put hints in a `VBox` around the form instead.

### `motocycle_smart_elements`: Detail and Edit pages

Both pages are an ObjectPage with two tabs: "Motocycle Details" and "Technische Daten". Data is read via the OData V2
model into a JSON model (`detailModel` / `updateModel`). Field classification (analysed by an agent against CAP 9.9.3 and the V2 adapter):

| Field(s) | Edit page |
|---|---|
| `ID` | hidden (route parameter) |
| `name`, `typ`, `company_ID`, `jahr`, `preis`, `hubraum` | editable, required (*) |
| `farbe`, `motorbauart` | editable, ComboBox with suggestions (free text allowed) |
| `typ`, `kuehlung`, `antrieb`, `fuehrerscheinklasse` | editable, Select with exactly the values that occur in the CSV |
| other technical fields | editable, `Int32` / `Decimal` types (input validation in the UI); empty input → `null` |
| `leistung_ps` **and** `leistung_kw` | both editable: they are published, rounded values and can't be converted reliably into each other |
| `beschreibung` / `quelle_url` | TextArea maxLength 500 / Input type Url |
| `discount`, `hasDiscount`, `discountPrice` | **read-only display** with a hint: set by the server based on `jahr` |

`Update.controller.js` sends only `EDITABLE_FIELDS`, not the whole JSON model. Before saving it checks
`REQUIRED_FIELDS` and the input validation errors from `sap/ui/core/Messaging`, counting only messages attached to a
control (server errors from earlier saves must not block). Server validation messages (e.g. `@assert.range`) are shown in a `MessageBox`.

Checked in headless Chrome against the local server:
- Both pages render.
- A type error blocks saving.
- An empty required field blocks saving.
- `zylinder = 12` shows the server message "Enter a value between 1 and 8."
- A valid save stores the values and `null` for cleared fields, leaves the discount untouched, and navigates back.

## Auth and deployment

- Local: mocked auth, any mocked user (e.g. `alice:`) is accepted.
- Production: `cds.requires.auth.kind = jwt` with the XSUAA instance `trainig-xsuaa-service` (`xs-security.json`, scope `uaa.user`).
- Services have **no** `@requires` / `@restrict` yet, so every authenticated user has full CRUD access.
- The app router config (`xs-app.json` per app) routes through the HTML5 repo and requires `xsuaa` authentication.

## Change log

### 2026-10-12 – backend review fixes

| # | Problem | Fix |
|---|---|---|
| 1 | `srv/server.js` required `@sap/xsenv`, which is not a dependency, so startup would fail | removed it; CAP loads `default-env.json` itself |
| 2 | `getMotocyclesByCompany*` declared `returns array of String` but returned records | `returns array of Motocycle` |
| 3 | `helloAction` had no handler, so calls returned 501 | handler added |
| 4 | `discountPrice` was a `virtual` field filled in `after('READ')` with a loop over `.length`. A single read by key never ran the loop, and with `$select` (as Fiori sends) `discount`/`hasDiscount` were missing, so it returned the full price (Tenere: 7000 instead of 6300). Filtering and sorting were impossible | replaced with a **calculated element** in `db/schema.cds`; the after-handler was removed |
| 5 | discount rule ran only on `CREATE` | runs on `CREATE` and `UPDATE` |
| 6 | `bestell_datum : String`, `gesamt_summe : Decimal` without precision | `Date`, `Decimal(9,2)` |
| 7 | function-style handler file used `cds.connect.to("db")` and string entity names, and was applied to both services | class-based `cds.ApplicationService`, `this.entities`, `this.read()` |

Checked locally (SQLite + CSV): list, read by key, `$select`, `$filter`/`$orderby` on `discountPrice`, both
hello endpoints, both company endpoints, CREATE with `jahr` 2015 and PATCH `jahr` 2018 (both get the discount).
`cds compile --to sql --dialect hana` is clean. **Not yet deployed to HANA Cloud.**

HANA deployment note: `bestell_datum` changes from `NVARCHAR` to `DATE`. The existing values are ISO dates and the
table is reloaded from CSV, so the HDI migration should work, but check it on the first deployment.

### 2026-10-12 – motorcycle data enrichment

- Added 15 technical fields to `Motocycle`, added Honda to `Company`, and grew `Motocycle` from 4 to 28 rows (see "Initial data").
- How it was produced: an orchestrator agent coordinated two research agents (one for Honda + Yamaha, one for BMW) and a CSV writer agent.
- Fixed integer division in `discountPrice` on SQLite (`/ 100` → `/ 100.0`).
- Checked: HANA compile is clean, the CSV loads without errors, `$count` = 28, every `company` resolves, `discountPrice` is correct for all discounted rows (e.g. FZ1 10195 → 9175.5), `$filter` on new fields works, and `getMotocyclesByCompany` works for Honda.
- The UI apps don't show the new fields yet (no annotations or views changed).

### 2026-10-19 – technical data in `motocycle_smart_elements`

- Detail view: new tab "Technische Daten" (Motor & Antrieb, Gewicht & Abmessungen, Allgemein) with `model/formatter.js`.
  The source URL is shown as a link.
- Edit view: rebuilt from the field classification above (typed inputs, Selects with the real values, read-only discount group).
- Fixed the `typ` ComboBox, which offered keys that don't exist in the data (`SPORT`, `CHOPPER`).
- Edit controller: sends only editable fields, shows server errors, and no longer uses globals (`sap.m.MessageToast`, `sap.ui.model.json.JSONModel`).
- Removed template leftovers: the "Address" form title and `beforeNavigate=".onBeforeNavigate"`, which had no handler.
- Server: `@mandatory`, `@readonly`, `@assert.range` and `@assert.format` on `MotocycleService.Motocycle`.

## Open issues (not fixed yet)

1. **`@sap/xssec` missing**: production auth (`jwt`) needs it. `trainig-srv` will probably fail on CF.
   Fix: `npm add @sap/xssec` (or `cds add xsuaa`).
2. **`npm ci` fails**: `package-lock.json` is out of sync with the workspaces. The probable cause is the extra
   `app/motorcycle_fcl` folder. The MTA builder `npm-ci` is affected too. Fix: decide what to do with
   `app/motorcycle_fcl` (it duplicates `motocycle_fcl`, isn't deployed and has no annotations import), then regenerate the lockfile.
3. **`book` app is orphaned**: it points to `/odata/v4/catalog/` and annotates `CatalogService.Books`, but neither exists.
   Either remove the app (folder, `mta.yaml` module, `app/services.cds` line, `sapux` entry) or add the service.
4. **No authorization model**: add `@requires` / `@restrict` and matching role templates in `xs-security.json`.
5. **Discount isn't removed** when `jahr` is updated to 2020 or later. Decide whether that is the intended business rule.
6. `Kunden` CSV has no `land_code` column, so `land` is empty for all customers (data gap, not a bug).
7. **New motorcycle fields are only in `motocycle_smart_elements` (Detail + Edit)**: still missing in `motocycle_fiori`
   (e.g. a FieldGroup "Technische Daten" in its `annotations.cds`), `motocycle_freestyle` and `motocycle_fcl`.
8. **WR125R is licence class `A1`**: the data allows A1 although the original spec only mentioned A/A2. Change it to `A2` if exercises expect only A/A2.
9. **`typ` keys in other Create/Update dialogs**: `motocycle_freestyle` (Create/Update) and the smart elements Create
   view use `SPORT` / `CHOPPER`, which don't match the data (`Sport`, `Cruiser`, …). Planned server-side fix once the
   UIs are aligned: `typ : String @assert.range enum { ADV; Sport; Naked; Touring; Cruiser; SportTouring = 'Sport-Touring'; Enduro; }`
   in `db/schema.cds` (an enum can't be added via `annotate`).
10. **`@mandatory` for `jahr`, `preis`, `company`** isn't on the server yet: the Create dialogs of `motocycle_fiori` and others
    don't send these fields. Add the fields to those dialogs first, then add the annotations.
11. `motocycle_smart_elements/webapp/controller/Create.controller.js` uses `Fragment`, `Filter`, `FilterOperator` without
    importing them, so the value help crashes. The Create view isn't extended with the technical fields yet.

## Rules for agents and contributors

- Follow the CAP docs and UI5 docs linked above. When in doubt, use the pattern from the docs.
- Keep German domain names and the existing `Motocycle` spelling.
- Put derived values in CDS (calculated elements) rather than in JS handlers when the database can compute them.
- Use handlers for validations and business rules: `before` for validation and defaults, `on` for custom operations.
- Every new entity with initial data needs a `db/data/db-<Entity>.csv` file.
- After model changes run `cds compile db srv --to sql --dialect hana` to catch HANA problems early.
- Update the change log and open issues in this file when you fix or find something.
