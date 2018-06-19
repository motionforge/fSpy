import { app, Menu, clipboard } from 'electron'
import ProjectFile from '../gui/io/project-file'

export interface AppMenuCallbacks {
  onNewProject(): void
  onOpenProject(): void
  onSaveProject(): void
  onSaveProjectAs(): void
  onOpenImage(): void
  onOpenExampleProject(): void
  onQuit(): void
}

export default class AppMenuManager {
  readonly menu: Menu
  readonly callbacks: AppMenuCallbacks

  constructor(callbacks: AppMenuCallbacks) {
    this.callbacks = callbacks

    let newItem = {
      label: 'New',
      accelerator: 'CommandOrControl+N',
      click: () => {
        this.callbacks.onNewProject()
      }
    }

    let openItem = {
      label: 'Open',
      accelerator: 'CommandOrControl+O',
      click: () => {
        this.callbacks.onOpenProject()
      }
    }

    let saveItem = {
      label: 'Save',
      id: 'save',
      accelerator: 'CommandOrControl+S',
      click: () => {
        this.callbacks.onSaveProject()
      }
    }

    let saveAsItem = {
      label: 'Save as',
      id: 'save-as',
      accelerator: 'CommandOrControl+Shift+S',
      click: () => {
        this.callbacks.onSaveProjectAs()
      }
    }

    let openImageItem = {
      label: 'Open image',
      id: 'open-image',
      accelerator: 'CommandOrControl+Shift+O',
      click: () => {
        this.callbacks.onOpenImage()
      }
    }

    let openExampleProjectItem = {
      label: 'Open example project',
      id: 'open-example-project',
      click: () => {
        this.callbacks.onOpenExampleProject()
      }
    }

    let quitMenuItem: Electron.MenuItemConstructorOptions = {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        this.callbacks.onQuit()
      }
    }

    let fileMenuItems: Electron.MenuItemConstructorOptions[] = [
      newItem,
      openItem,
      saveItem,
      saveAsItem,
      { type: 'separator' },
      openImageItem,
      openExampleProjectItem
    ]

    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push(quitMenuItem)
    }

    let fileMenu = {
      label: 'File',
      submenu: fileMenuItems
    }

    let menus = [fileMenu]
    if (process.env.DEV) {
      let devMenu = {
        label: 'Dev',
        submenu: [
          {
            label: 'Copy state to clipboard',
            click: () => {
              clipboard.writeText(
                JSON.stringify(ProjectFile.getStateToSave(),
                  null,
                  2
                )
              )
              console.log('Copied state to clipboard')
            }
          }
        ]
      }
      menus.push(devMenu)
    }

    if (process.platform === 'darwin') {
      menus.unshift({
        label: app.getName(),
        submenu: [
          quitMenuItem
        ]
      })
    }

    this.menu = Menu.buildFromTemplate(menus)
  }

  setOpenImageItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('open-image').enabled = enabled
  }

  setSaveItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save').enabled = enabled
  }

  setSaveAsItemEnabled(enabled: boolean) {
    this.menu.getMenuItemById('save-as').enabled = enabled
  }
}
