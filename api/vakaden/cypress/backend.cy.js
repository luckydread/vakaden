// Please, do not change this file.

describe('Backend Test Spec', () => {
  const apiUrl = Cypress.config().baseUrl
  let sessionId = null
  const testEmail = `test-${Date.now()}@example.com`

  it('should call index', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}`,
    }).then((response) => {
      assert.equal(response.status, 200, "The application should respond with 200 on index request")
    })
  })

  it('should register a user', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/register`,
      body: {
        email: testEmail,
        password: 'Test123456'
      }
    }).then((response) => {
      assert.equal(response.status, 201, "First registration should succeed")
    })
  })

  it('should fail to register existing user', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/register`,
      body: {
        email: testEmail,
        password: 'Test123456'
      }
    }).then((response) => {
      assert.equal(response.status, 400, "Duplicate registration should return 400")
      assert.equal(response.body.error, "Email already registered", "Error message should be correct")
    })
  })

  it('should login a user', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/login`,
      body: {
        email: 'test@example.com',
        password: 'Test123456'
      }
    }).then((response) => {
      assert.equal(response.status, 200, "Login should succeed")
      sessionId = response.body.session_id
      assert.isNotNull(sessionId, "Session ID should be returned")
    })
  })

  it('should check session', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: `${apiUrl}/check-session`,
      headers: {
        'Cookie': `sessionid=${sessionId}`
      }
    }).then((response) => {
      assert.equal(response.status, 200, "Session check should succeed")
      assert.isTrue(response.body.is_authenticated, "User should be authenticated")
      assert.equal(response.body.session_id, sessionId, "Session ID should match")
    })
  })

  it('should logout', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: `${apiUrl}/logout`,
      headers: {
        'Cookie': `sessionid=${sessionId}`
      }
    }).then((response) => {
      assert.equal(response.status, 200, "Logout should succeed")
    })
  })
})