# zea-form-profile

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description  | Type      | Default                                                                                          |
| ------------------ | -------------------- | ------------ | --------- | ------------------------------------------------------------------------------------------------ |
| `showLabels`       | `show-labels`        |              | `boolean` | `true`                                                                                           |
| `submitButtonText` | `submit-button-text` | A test prop. | `string`  | `'SAVE'`                                                                                         |
| `userData`         | `user-data`          |              | `any`     | `{}`                                                                                             |
| `welcomeHtml`      | `welcome-html`       | A test prop. | `string`  | ``Welcome to Zea Construction. We just need <br />a few details and   then you're ready to go.`` |


## Events

| Event            | Description | Type               |
| ---------------- | ----------- | ------------------ |
| `userRegistered` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [zea-dialog-profile](../zea-dialog-profile)

### Depends on

- [zea-form](../zea-form)
- [zea-input-text](../zea-input-text)
- [zea-input](../zea-input)

### Graph
```mermaid
graph TD;
  zea-form-profile --> zea-form
  zea-form-profile --> zea-input-text
  zea-form-profile --> zea-input
  zea-form --> zea-button
  zea-input --> zea-icon
  zea-icon --> ion-icon
  zea-dialog-profile --> zea-form-profile
  style zea-form-profile fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
