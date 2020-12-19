import { AppPage } from './app.po';
import {browser, logging, protractor} from 'protractor';

describe('selfshare frontend', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display header buttons', () => {
    page.navigateTo('');
    expect(page.getHeaderButtonLink()).toEqual('/');
  });

  it('should display home page', () => {
    page.navigateTo('');
    expect(page.getGalleryText()).toEqual('none');
  });

  it('should display about page', () => {
    page.navigateTo('about');
    expect(page.getAboutImage()).toEqual('profile image');
  });

  it('should display disclaimer page', () => {
    page.navigateTo('disclaimer');
    expect(page.getDisclaimerTitle()).toMatch(/disclaimer/i);
  });

  it('should display login page', () => {
    page.navigateTo('login');
    expect(page.getLoginTitle()).toMatch(/login/i);
  });

  it('should display login error on empty input', () => {
    page.navigateTo('login');
    page.clickLoginButton();
    expect(page.getLoginErrorText()).toEqual('The credentials are wrong. Please try again!');
  });

  it('should display login error on short password', () => {
    page.navigateTo('login');
    page.fillLoginCredentials();
    page.clickLoginButton();
    expect(page.getLoginErrorText()).toEqual('The credentials are wrong. Please try again!');
  });

  it('should display dashboard page on successful login', () => {

  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
