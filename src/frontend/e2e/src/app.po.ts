import {browser, by, element, ElementFinder} from 'protractor';

export class AppPage {
  navigateTo(path: string): Promise<unknown> {
    return browser.get(browser.baseUrl + path) as Promise<unknown>;
  }

  getGalleryText(): Promise<string> {
    return element(by.css('#loading-spinner')).getCssValue('display') as Promise<string>;
  }

  getHeaderButtonLink(): Promise<string> {
    return element(by.css('.active a')).getAttribute('routerlink') as Promise<string>;
  }

  getAboutImage(): Promise<string> {
    return element(by.css('app-about img')).getAttribute('alt') as Promise<string>;
  }

  getDisclaimerTitle(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getLoginTitle(): Promise<string> {
    return element(by.css('h4')).getText() as Promise<string>;
  }

  fillLoginCredentials(): void{
    element(by.css('#inputUsername')).sendKeys('admin');
    element(by.css('#inputPassword')).sendKeys('1234');
  }


  clickLoginButton(): void {
    element(by.css('[value="Login"]')).click();
  }

  getLoginErrorText(): Promise<string> {
    return element(by.css('.text-danger')).getText() as Promise<string>;
  }
}
