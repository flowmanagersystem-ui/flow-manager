import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

const LOCAL_STORAGE_KEY = 'FM:THEME'

type ColorThemeT   = 'dark' | 'light'

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _document = inject(DOCUMENT)

  public isCurrentThemeDark = signal(false)

  public getPreferredColorTheme(): ColorThemeT{
    const storedTheme = this._getStoredTheme()

    return storedTheme ? storedTheme : 'light'
  }

  private _getStoredTheme(): ColorThemeT | void{
    
    if(typeof localStorage == 'undefined') return

    /**
     * { colorTheme: 'dark | 'ligth } || {}
     * 
     */

    const storedThemeObject = localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}'

    const parsedStoredThemeObject = JSON.parse(storedThemeObject)

    return parsedStoredThemeObject.colorTheme

  }

  private _setStoredColorTheme(colorTheme: ColorThemeT): void{
    if (typeof localStorage == 'undefined') return

    const storedThemeObject: { colorTheme: ColorThemeT } = { colorTheme }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedThemeObject))
  }

  public setColorTheme(colorTheme: ColorThemeT): void {
    const isCurrentThemeDark = colorTheme == 'dark' ? true : false

    this.isCurrentThemeDark.set(isCurrentThemeDark)

    if(isCurrentThemeDark){
      this._document.documentElement.classList.add('dark')
    }
    else{
      this._document.documentElement.classList.remove('dark')
    }
  }

  public toggleColorTheme() :void{
    const currentColorTheme = this.isCurrentThemeDark() ? 'light' : 'dark'

    this.setColorTheme(currentColorTheme)
    this._setStoredColorTheme(currentColorTheme)
  }

}
