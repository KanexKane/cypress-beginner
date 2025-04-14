describe('KanexKane Blog', () => {
  beforeEach(() => {
    cy.visit('https://kanexkane.com')
  })

  it('TC-001 > มันควรจะค้นหาบทความได้นะ', () => {
    cy.get('div.desk-header a.msearch').click()
    cy.get('input.search-field').type('blazor')
    cy.get('input.search-submit').click()
    cy.get('div#content div.col-lg-8 h2').should('contain', 'blazor')
  })

  it('TC-002 > มันควรจะค้นหาบทความที่มี tag ว่า blazor ได้นะ', () => {
    cy.visit('https://kanexkane.com/?s=blazor')
    cy.get('div.tagcloud a[href*=blazor]').click()
    cy.url().should('include', 'tag/blazor')
    cy.get('h1.entry-title').should('contain', 'blazor')
  })

  it('TC-003 > โซเชี่ยลมีเดียลิงก์ของเราควรจะมี 2 จุด และทั้ง 4 อัน', () => {
    cy.get('ul.bs-social').should('have.length', 2)

    cy.get('ul.bs-social.info-left li').should('have.length', 4)
    cy.get('ul.bs-social.justify-content-center li').should('have.length', 4)
  })

  it('TC-004 > โซเชี่ยลมีเดียลิงก์ทั้ง 2 จุด ต้องมีลิงก์ไปโซเชี่ยลมีเดียอย่างถูกต้อง', () => {
    cy.get('ul.bs-social.info-left i.fa-facebook').parent()
      .should('have.attr', 'href')
      .and('include', 'facebook.com/kanexkanecom')
    cy.get('ul.bs-social.info-left i.fa-twitter').parent()
      .should('have.attr', 'href')
      .and('include', 'twitter.com/kanexkane')
    cy.get('ul.bs-social.info-left i.fa-youtube').parent()
      .should('have.attr', 'href')
      .and('include', 'youtube.com/kanexkane')
    cy.get('ul.bs-social.info-left i.fa-tiktok').parent()
      .should('have.attr', 'href')
      .and('include', 'tiktok.com/@kanexkane79')


    cy.get('ul.bs-social.justify-content-center i.fa-facebook').parent()
      .should('have.attr', 'href')
      .and('include', 'facebook.com/kanexkanecom')
    cy.get('ul.bs-social.justify-content-center i.fa-twitter').parent()
      .should('have.attr', 'href')
      .and('include', 'twitter.com/kanexkane')
    cy.get('ul.bs-social.justify-content-center i.fa-youtube').parent()
      .should('have.attr', 'href')
      .and('include', 'youtube.com/kanexkane')
    cy.get('ul.bs-social.justify-content-center i.fa-tiktok').parent()
      .should('have.attr', 'href')
      .and('include', 'tiktok.com/@kanexkane79')

  })

  it('TC-005 > ป้ายแบนเนอร์ Support US ต้องมี 2 จุด', () => {
    cy.get('img[src*="SUPPORT-US.png"]').should('have.length', 2)
  });

  it('TC-006 > ป้ายแบนเนอร์ Support US จุดด้านบน ต้องลิงก์ไปหน้า aff.kanexkane.com ได้ถูกต้อง', () => {
    cy.get('img[src*="SUPPORT-US.png"]').first().parent().invoke('removeAttr', 'target').click()
    cy.origin('https://aff.kanexkane.com', () => {
      cy.url().should('include', 'aff.kanexkane.com')
      cy.get('div.logo').next().should('contain', '@kanexkane79')

    });
  });

  it('TC-007 > ป้ายแบนเนอร์ Support US จุดด้านล่าง ต้องลิงก์ไปหน้า aff.kanexkane.com ได้ถูกต้อง', () => {
    cy.get('img[src*="SUPPORT-US.png"]').last().parent().invoke('removeAttr', 'target').click()
    cy.origin('https://aff.kanexkane.com', () => {
      cy.url().should('include', 'aff.kanexkane.com')
      cy.get('div.logo').next().should('contain', '@kanexkane79')

    });
  });

  it('TC-008 > ในหน้าแรกของเว็บไซต์ต้องมีหน้าปกขึ้นทุกบทความ', () => {
    cy.get('div[id^="post-"]').each(($el) => {
      cy.wrap($el).find('div.bs-blog-thumb').should('be.visible');
    });
  })

  it('TC-009 > กดดูบทความในหมวดหมู่ของบทความในหน้าแรกได้ และแสดงเฉพาะบทความในหมวดหมู่นั้นๆ', () => {
    cy.get('div[id^="post-"]').first().find('a.blogarise-categories').then(($el) => {
      const href = $el.attr('href');
      const text = $el.text().trim();

      cy.wrap($el).click();

      cy.url().should('eq', href);
      cy.get('h1.entry-title').should('contain', text);

      cy.get('div[id^="post-"]').each(($el) => {
        cy.wrap($el).find('a.blogarise-categories').should('contain', text);
      });
    });
  })

  it('TC-010 > กดดูบทความในวันที่ของบทความในหน้าแรกได้ และแสดงเฉพาะบทความในเดือนนั้นๆ', () => {
    cy.get('div[id^="post-"]').first().find('span.bs-blog-date a').then(($el) => {
      const href = $el.attr('href');
      const year = href.split('/')[3];
      const month = href.split('/')[4];

      cy.wrap($el).click();

      cy.url().should('eq', href);

      const yearThai = parseInt(year) + 543;
      const monthThai = new Date(year, month - 1).toLocaleString('th-TH', { month: 'long' });

      cy.get('h1.entry-title').should('contain', `${monthThai} ${yearThai}`);

      cy.get('div[id^="post-"]').each(($el) => {
        cy.wrap($el).find('span.bs-blog-date a time').invoke('text').then((text) => {

          cy.wrap(text).should('contain', `${month}/${yearThai}`);
        });
      });
    });
  })
})

