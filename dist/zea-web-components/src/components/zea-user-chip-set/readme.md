# zea-chip-set



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                     | Type      | Default     |
| --------------- | ----------------- | ----------------------------------------------- | --------- | ----------- |
| `initialZIndex` | `initial-z-index` | The initial z-index for chip overlapping        | `number`  | `1000`      |
| `overflowLimit` | `overflow-limit`  | Number of chips to show before overflow happens | `any`     | `5`         |
| `session`       | `session`         | The Zea session                                 | `any`     | `undefined` |
| `showImages`    | `show-images`     | Whether avatar images should be shown or not    | `boolean` | `true`      |


## Dependencies

### Used by

 - [zea-app-shell](../zea-app-shell)

### Depends on

- [zea-user-chip](../zea-user-chip)
- [zea-icon](../zea-icon)
- [zea-user-card](../zea-user-card)

### Graph
```mermaid
graph TD;
  zea-user-chip-set --> zea-user-chip
  zea-user-chip-set --> zea-icon
  zea-user-chip-set --> zea-user-card
  zea-user-chip --> zea-user-card
  zea-user-card --> zea-user-chip
  zea-user-card --> zea-icon
  zea-user-card --> zea-dialog-profile
  zea-icon --> ion-icon
  zea-dialog-profile --> zea-dialog
  zea-dialog-profile --> zea-scroll-pane
  zea-dialog-profile --> zea-form-profile
  zea-form-profile --> zea-form
  zea-form-profile --> zea-input-text
  zea-form-profile --> zea-input
  zea-form --> zea-button
  zea-input --> zea-icon
  zea-app-shell --> zea-user-chip-set
  style zea-user-chip-set fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
