import { storiesOf } from '@storybook/html'

storiesOf('Components/zea-user-card', module).add('Default', () => {
  const cardElement = document.createElement('zea-user-card')

  cardElement.userData = {
    firstName: 'Froilan',
    lastName: 'Moreno',
    phone: '3022788830',
    email: 'fonofondo@gmail.com',
    company: 'Zea Inc.',
  }

  return cardElement
})
