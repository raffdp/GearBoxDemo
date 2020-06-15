// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-user-chip', module)
  .add('With Avatar', () => {
    const user = {
      avatar: 'https://placeimg.com/640/420/any',
      firstName: 'John',
      lastName: 'Smith',
      phone: '12344567',
      email: 'test@example.com',
      company: 'Zea Inc.',
    }
    const zeaChipInstance = document.createElement('zea-user-chip')
    zeaChipInstance.userData = user
    return zeaChipInstance
  })
  .add('Without Avatar', () => {
    const user = {
      avatar: null,
      firstName: 'John',
      lastName: 'Smith',
      phone: '123456789',
      email: 'test@example.com',
      company: 'Zea Inc.',
    }
    const zeaChipInstance = document.createElement('zea-user-chip')
    zeaChipInstance.userData = user
    return zeaChipInstance
  })
  .add('Current User', () => {
    let user
    const storedUserData = localStorage.getItem('zea-user-data')
    if (storedUserData) {
      user = JSON.parse(storedUserData)
    } else {
      user = {
        avatar: null,
        firstName: 'John',
        lastName: 'Smith',
        phone: '123456789',
        email: 'test@example.com',
        company: 'Zea Inc.',
      }
    }

    const zeaChipInstance = document.createElement('zea-user-chip')
    zeaChipInstance.userData = user
    zeaChipInstance.isCurrentUser = true
    return zeaChipInstance
  })
