# zea-user-card



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute               | Description                                              | Type      | Default     |
| --------------------- | ----------------------- | -------------------------------------------------------- | --------- | ----------- |
| `additionalDataShown` | `additional-data-shown` | Whether additional data is currently shown               | `boolean` | `undefined` |
| `collapsible`         | `collapsible`           | Whether to show the collpase control for additional data | `boolean` | `true`      |
| `density`             | `density`               | Density and size of elements                             | `string`  | `'normal'`  |
| `isCurrentUser`       | `is-current-user`       | Whether the card is for the current user session         | `boolean` | `false`     |
| `userData`            | `user-data`             |                                                          | `any`     | `undefined` |


## Dependencies

### Used by

 - [zea-user-chip](../zea-user-chip)
 - [zea-user-chip-set](../zea-user-chip-set)

### Depends on

- [zea-user-chip](../zea-user-chip)
- [zea-icon](../zea-icon)
- [zea-dialog-profile](../zea-dialog-profile)

### Graph
```mermaid
graph TD;
  zea-user-card --> zea-user-chip
  zea-user-card --> zea-icon
  zea-user-card --> zea-dialog-profile
  zea-user-chip --> zea-user-card
  zea-icon --> ion-icon
  zea-dialog-profile --> zea-dialog
  zea-dialog-profile --> zea-scroll-pane
  zea-dialog-profile --> zea-form-profile
  zea-form-profile --> zea-form
  zea-form-profile --> zea-input-text
  zea-form-profile --> zea-input
  zea-form --> zea-button
  zea-input --> zea-icon
  zea-user-chip-set --> zea-user-card
  style zea-user-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
