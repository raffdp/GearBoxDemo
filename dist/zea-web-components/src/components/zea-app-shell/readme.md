# zea-app-shell



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description | Type     | Default                                                     |
| ----------------------- | ------------------------- | ----------- | -------- | ----------------------------------------------------------- |
| `centerProgressBar`     | `center-progress-bar`     |             | `any`    | `undefined`                                                 |
| `centerProgressMessage` | `center-progress-message` |             | `string` | `''`                                                        |
| `leftPanelWidth`        | `left-panel-width`        |             | `string` | `'200'`                                                     |
| `leftProgressBar`       | `left-progress-bar`       |             | `any`    | `undefined`                                                 |
| `leftProgressMessage`   | `left-progress-message`   |             | `string` | `''`                                                        |
| `logoUrl`               | `logo-url`                |             | `string` | `'https://storage.googleapis.com/misc-assets/zea-logo.png'` |
| `rightPanelWidth`       | `right-panel-width`       |             | `string` | `'200'`                                                     |
| `rightProgressBar`      | `right-progress-bar`      |             | `any`    | `undefined`                                                 |
| `rightProgressMessage`  | `right-progress-message`  |             | `string` | `''`                                                        |
| `session`               | `session`                 |             | `any`    | `{}`                                                        |
| `userData`              | `user-data`               |             | `any`    | `{}`                                                        |


## Events

| Event               | Description | Type               |
| ------------------- | ----------- | ------------------ |
| `userAuthenticated` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [zea-layout](../zea-layout)
- [zea-navigation-drawer](../zea-navigation-drawer)
- [zea-menu-item](../zea-menu-item)
- [zea-icon](../zea-icon)
- [zea-user-chip-set](../zea-user-chip-set)
- [zea-input-search](../zea-input-search)
- [zea-user-chip](../zea-user-chip)
- [zea-panel-progress-bar](../zea-panel-progress-bar)
- [zea-dialog-profile](../zea-dialog-profile)
- [zea-dialog-share](../zea-dialog-share)

### Graph
```mermaid
graph TD;
  zea-app-shell --> zea-layout
  zea-app-shell --> zea-navigation-drawer
  zea-app-shell --> zea-menu-item
  zea-app-shell --> zea-icon
  zea-app-shell --> zea-user-chip-set
  zea-app-shell --> zea-input-search
  zea-app-shell --> zea-user-chip
  zea-app-shell --> zea-panel-progress-bar
  zea-app-shell --> zea-dialog-profile
  zea-app-shell --> zea-dialog-share
  zea-navigation-drawer --> zea-icon
  zea-icon --> ion-icon
  zea-menu-item --> zea-checkbox
  zea-menu-item --> zea-switch
  zea-user-chip-set --> zea-user-chip
  zea-user-chip-set --> zea-icon
  zea-user-chip-set --> zea-user-card
  zea-user-chip --> zea-user-card
  zea-user-card --> zea-user-chip
  zea-user-card --> zea-icon
  zea-user-card --> zea-dialog-profile
  zea-dialog-profile --> zea-dialog
  zea-dialog-profile --> zea-scroll-pane
  zea-dialog-profile --> zea-form-profile
  zea-form-profile --> zea-form
  zea-form-profile --> zea-input-text
  zea-form-profile --> zea-input
  zea-form --> zea-button
  zea-input --> zea-icon
  zea-panel-progress-bar --> zea-dialog
  zea-panel-progress-bar --> zea-progress-bar
  zea-dialog-share --> zea-dialog
  zea-dialog-share --> zea-tabs
  zea-dialog-share --> zea-qr-code
  zea-dialog-share --> zea-copy-link
  zea-copy-link --> zea-icon
  style zea-app-shell fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
