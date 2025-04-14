describe('Test Login', () => {

    beforeEach(() => {
        cy.visit('https://kanexkane.com/kkadmin')
    });

    it('มันต้องเข้าสู่ระบบไม่ได้นะ เพราะ User/Pass ผิด', () => {
        cy.get('input#user_login').type('wronguser')
        cy.get('input#user_pass').type('wrongpassword')
        cy.get('input#wp-submit').click()

        cy.url().should('include', 'wp-login.php?itsec-hb-token=kkadmin')
        cy.get('div#login_error').should('be.visible')
    });

    it('มันต้องเข้าสู่ระบบได้นะ', () => {
        cy.get('input#user_login').clear().type('testermaster')
        cy.get('input#user_pass').type('Tm123$%^')
        cy.get('input#wp-submit').click()

        cy.url().should('include', 'wp-admin')
        cy.get('div.wrap h1').should('contain', 'แผงควบคุม')
    });
});

describe('User LoggedIn', () => {

    let postId = 0;

    beforeEach(() => {

        cy.session('myLoginSession', () => {
            cy.visit('https://kanexkane.com/kkadmin')
            cy.get('input#user_login').clear().type('testermaster')
            cy.get('input#user_pass').type('Tm123$%^')
            cy.get('input#wp-submit').click()
            cy.url().should('include', 'wp-admin')
        });

        cy.visit('https://kanexkane.com/wp-admin')
    });

    it('มันต้องเพิ่มบทความได้นะ', () => {
        const postTitle = 'Test new post';
        const postContent = 'descript of Test new post';

        cy.get('input#title').type(postTitle);
        cy.get('textarea#content').type(postContent);
        cy.get('input#save-post').click();

        cy.get('div.drafts h2').should('contain', 'ฉบับร่างล่าสุดของคุณ');
        cy.get('div.draft-title a').should('contain', postTitle);

        cy.get('div.draft-title a').invoke('attr', 'href').then((href) => {
            const url = new URL(href);
            const id = url.searchParams.get('post');
            expect(id).to.exist;
            postId = id;
        });
    });

    it('มันต้องลบบทความได้นะ', () => {
        if (postId === 0) {
            throw new Error('postId is not set');
        }

        cy.visit('https://kanexkane.com/wp-admin/edit.php');

        cy.get(`tr#post-${postId} td.title div.row-actions span.trash a`).click({ force: true })

        cy.get('div#message').should('be.visible')
    });
});