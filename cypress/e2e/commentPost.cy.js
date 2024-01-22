describe('Comment on a post spec', () => {
  it('passes', () => {
    // launch the web app
    cy.visit('http://localhost:3000')

    // login with username 1 and password 1
    cy.get('#username').type('Tai');
    cy.get('#password').type('%H24>T2%w#:z?Pr');
    cy.get('button[type="submit"]').click();


    // Comment on a post
    cy.get('input[placeholder="Add a comment..."]').type("This is a cypress test comment");

    // Click the "Post" button
    cy.get('button').contains('Post').click();

    // Check if the comment is visible
    cy.contains('View all').click();
    cy.contains('This is a cypress test comment').should('be.visible');
  })
})