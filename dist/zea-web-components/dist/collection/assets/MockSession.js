import { Session } from '@zeainc/zea-collab'

/**
 * Class to simulate user sessions comming and going
 */
class MockSession {
  sessions = []
  actions = []
  socketUrl
  roomData
  names = [
    'Liam',
    'Emma',
    'Noah',
    'Olivia',
    'William',
    'Ava',
    'James',
    'Isabella',
    'Oliver',
    'Sophia',
  ]
  surnames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Miller',
    'Davis',
    'Garcia',
    'Rodriguez',
    'Wilson',
  ]

  /**
   * Class constructor
   * @param {any} socketUrl the url of the socket to connect to
   */
  constructor(socketUrl) {
    const session = new Session(this.getRandomUserData(), socketUrl)

    this.roomData = {
      project: this.getRandomString(4),
      file: this.getRandomString(4),
      room: this.getRandomString(4),
    }

    session.joinRoom(
      this.roomData.project,
      this.roomData.file,
      this.roomData.room
    )

    this.socketUrl = socketUrl
    this.sessions.push(session)
    // this.actions = [this.removeUser, this.addUser]
    this.actions = [this.addUser]
    this.randomizeSessions()
  }

  /**
   * Intermitently call one of the registed actions (add/remove user, etc)
   */
  randomizeSessions() {
    const seconds = 0 + Math.floor(Math.random() * 1000)
    const action = this.actions[Math.floor(Math.random() * this.actions.length)]
    setTimeout(() => {
      action.call(this)
      if (this.sessions.length < 29) this.randomizeSessions()
    }, seconds)
  }

  /**
   * Create a use session and join the room
   */
  addUser() {
    if (this.sessions.length > 20) {
      // this.removeUser()
      // return
    }

    const session = new Session(this.getRandomUserData(), this.socketUrl)
    session.joinRoom(
      this.roomData.project,
      this.roomData.file,
      this.roomData.room
    )
    this.sessions.push(session)
  }

  /**
   * Remove the user from the room
   */
  removeUser() {
    if (this.sessions.length < 10) {
      this.addUser()
      return
    }

    let sessionIndex = Math.ceil(Math.random() * this.sessions.length)

    // make sure we have a session that's not the first one (ie. not index zero)
    if (!sessionIndex) sessionIndex = this.sessions.length - 1
    if (!sessionIndex) return

    const session = this.sessions[sessionIndex]

    if (session) session.leaveRoom()

    this.sessions.splice(sessionIndex, 1)

    this.sessions.sort()
  }

  /**
   * Generate a random user data entry
   * @return {any} the random user data
   */
  getRandomUserData() {
    return {
      id: new Date().getMilliseconds(),
      firstName: this.getRandomName(),
      lastName: this.getRandomLastname(),
      phone: '321 456 7890',
      email: 'someone@example.com',
      company: 'Zea Inc.',

      // randomize picture size url param to avoid cache
      picture: `https://placekitten.com/800/${
        800 - Math.floor(Math.random() * 200)
      }`,
    }
  }

  /**
   * Generate a random user name
   * @return {any} the random user name
   */
  getRandomName() {
    return this.names[Math.floor(Math.random() * this.names.length)]
  }

  /**
   * Generate a random user name
   * @return {any} the random user name
   */
  getRandomLastname() {
    return this.surnames[Math.floor(Math.random() * this.surnames.length)]
  }

  /**
   * Get the first session created
   * @return {any} the first session created
   */
  getSession() {
    return this.sessions[0]
  }

  /**
   * Generate a random string of a certain length
   * @param {number} length number of characters of the resulting string
   * @return {string} the resulting string
   */
  getRandomString(length) {
    let result = ''
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}

export default MockSession
