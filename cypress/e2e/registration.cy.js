describe('Comment on a post spec', () => {
    it('passes', () => {
      // launch the web app
      cy.visit('http://localhost:3000')
  
      // go to the signup page
      cy.contains('Sign Up!').click();

      // Sign up
      cy.get('#signup-username').type('cypress');
      cy.get('#signup-password').type('Cypress12345!');
      cy.get('#confirmPassword').type('Cypress12345!');
      cy.get('button[type="submit"]').click();
      
      // Log in
      cy.get('#username').type('cypress');
      cy.get('#password').type('Cypress12345!');
      cy.get('button[type="submit"]').click();

      // Go to profile
      cy.contains('My Profile').click();

      cy.contains('cypress').should('be.visible');
    })
  })