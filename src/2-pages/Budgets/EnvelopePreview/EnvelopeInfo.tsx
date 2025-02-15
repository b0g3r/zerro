import type { TDateDraft, TFxAmount, TISOMonth } from '6-shared/types'
import React from 'react'
import {
  Box,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemButton,
  useTheme,
} from '@mui/material'
import { Total } from '6-shared/ui/Total'
import { Amount } from '6-shared/ui/Amount'
import { convertFx } from '6-shared/helpers/money'
import {
  formatDate,
  parseDate,
  prevMonth,
  toISOMonth,
} from '6-shared/helpers/date'

import { OneLiner } from '3-widgets/DataLine'

import { TEnvelopeId } from '5-entities/envelope'
import { balances, TrFilterMode } from '5-entities/envBalances'

import { cardStyle } from './shared'
import { useBudgetPopover } from '../BudgetPopover'
import { useTrDrawer } from '../useTrDrawer'

function getPrepositionalMonthName(month: TISOMonth | TDateDraft) {
  const monthNames = [
    'январе',
    'феврале',
    'марте',
    'апреле',
    'мае',
    'июне',
    'июле',
    'августе',
    'сентябре',
    'октябре',
    'ноябре',
    'декабре',
  ]
  const monthIndex = parseDate(month).getMonth()
  return monthNames[monthIndex]
}

export function EnvelopeInfo(props: { month: TISOMonth; id: TEnvelopeId }) {
  const { month, id } = props
  const theme = useTheme()
  const showTransactions = useTrDrawer()
  const openBudgetPopover = useBudgetPopover()
  const rates = balances.useRates()[month].rates
  const envMetrics = balances.useEnvData()[month][id]

  if (!envMetrics) return null

  const { currency } = envMetrics
  const toEnvelope = (a: TFxAmount) => convertFx(a, currency, rates)
  const totalLeftover = toEnvelope(envMetrics.totalLeftover)
  const totalBudgeted = toEnvelope(envMetrics.totalBudgeted)
  const totalActivity = toEnvelope(envMetrics.totalActivity)
  const totalAvailable = toEnvelope(envMetrics.totalAvailable)

  const currentMonth = toISOMonth(new Date())

  const blockTitle =
    currentMonth === month
      ? 'Доступно сейчас'
      : month > currentMonth
      ? `Будет доступно в ${getPrepositionalMonthName(month)}`
      : `Осталось в конце ${formatDate(month, 'MMMM')}`

  return (
    <Box
      sx={{
        ...cardStyle,
        '--color': theme.palette.text.secondary,
      }}
    >
      <Stack spacing={1.5} py={1}>
        <Total
          title={blockTitle}
          value={totalAvailable}
          decMode="ifAny"
          currency={currency}
          noShade
          amountColor={
            totalAvailable < 0
              ? 'error.main'
              : totalAvailable > 0
              ? 'success.main'
              : undefined
          }
        />
        <Divider light />
      </Stack>
      <List dense sx={{ mx: -2, color: 'text.secondary' }}>
        <ListItem>
          <OneLiner
            left={`Остаток с ${formatDate(prevMonth(month), 'MMMM')}`}
            right={
              <Amount
                value={totalLeftover}
                currency={currency}
                decMode="ifAny"
              />
            }
          />
        </ListItem>

        <ListItemButton
          sx={{
            '&:hover': { color: 'text.primary' },
            transition: '.2s ease-in-out',
          }}
          onClick={e => openBudgetPopover(id, e.currentTarget)}
        >
          <OneLiner
            left={`Бюджет`}
            right={
              <Amount
                value={totalBudgeted}
                currency={currency}
                decMode="ifAny"
              />
            }
          />
        </ListItemButton>

        <ListItemButton
          sx={{
            '&:hover': { color: 'text.primary' },
            transition: '.2s ease-in-out',
          }}
          onClick={() =>
            showTransactions({ id, month, mode: TrFilterMode.Envelope })
          }
        >
          <OneLiner
            left={
              <span>
                <span>{`Операции `}</span>
                {Boolean(envMetrics.totalTransactions.length) && (
                  <span style={{ opacity: 0.5 }}>
                    {envMetrics.totalTransactions.length}
                  </span>
                )}
              </span>
            }
            right={
              <Amount
                value={totalActivity}
                currency={currency}
                decMode="ifAny"
              />
            }
          />
        </ListItemButton>
      </List>
    </Box>
  )
}
