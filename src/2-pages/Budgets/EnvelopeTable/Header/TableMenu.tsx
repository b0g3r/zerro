import React, { useCallback } from 'react'
import { Menu, MenuItem, PopoverProps } from '@mui/material'
import { registerPopover } from '6-shared/historyPopovers'

type TableMenuProps = {
  isAllShown: boolean
  isReordering: boolean
  onShowAllToggle: () => void
  onReorderModeToggle: () => void
}

const tableMenu = registerPopover<TableMenuProps, PopoverProps>('tableMenu', {
  isAllShown: false,
  isReordering: false,
  onShowAllToggle: () => {},
  onReorderModeToggle: () => {},
})

export const useTableMenu = (props: TableMenuProps) => {
  const { open } = tableMenu.useMethods()
  return useCallback(
    (e: React.MouseEvent) => open({ ...props }, { anchorEl: e.currentTarget }),
    [open, props]
  )
}

export function TableMenu() {
  const popover = tableMenu.useProps()
  const { onShowAllToggle, onReorderModeToggle, isReordering, isAllShown } =
    popover.extraProps

  return (
    <Menu {...popover.displayProps}>
      <MenuItem
        onClick={() => {
          popover.close()
          onShowAllToggle()
        }}
      >
        {isAllShown ? 'Скрыть часть категорий' : 'Показать все категории'}
      </MenuItem>
      <MenuItem
        onClick={() => {
          popover.close()
          onReorderModeToggle()
        }}
      >
        {isReordering ? 'Выйти из режима редактирования' : 'Режим редактирования'}
      </MenuItem>
    </Menu>
  )
}
