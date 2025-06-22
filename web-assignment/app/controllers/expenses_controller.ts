import Category from '#models/category'
import Expense from '#models/expense'
import { createExpenseValidator } from '#validators/expense'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Application from '@adonisjs/core/services/app' // for file upload

export default class ExpensesController {
  async index({ view }: HttpContext) {
    const categories = await Category.all()
    const expenses = await Expense.query().preload('category')
    return view.render('pages/expenses/list', { categories, expenses })
  }

  async create({ view }: HttpContext) {
    const categories = await Category.all()
    return view.render('pages/expenses/create', { categories })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createExpenseValidator)
    const category = await Category.findOrFail(payload.categoryId)

    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    let imagePath = ''

    if (image) {
      await image.move(Application.publicPath('uploads'), {
        name: `${new Date().getTime()}.${image.extname}`,
        overwrite: true,
      })
      imagePath = image.fileName!
    }

    await category.related('expenses').create({
      title: payload.title,
      amount: payload.amount,
      transactionDate: DateTime.fromJSDate(payload.transactionDate),
      imagePath,
    })

    response.redirect('/expenses')
  }

  async edit({ params, view }: HttpContext) {
    const expense = await Expense.query().where('id', params.id).preload('category').firstOrFail()
    const categories = await Category.all()
    return view.render('pages/expenses/edit', { expense, categories })
  }

  async update({ params, request, response }: HttpContext) {
    const expense = await Expense.findOrFail(params.id)
    const payload = await request.validateUsing(createExpenseValidator)

    expense.title = payload.title
    expense.amount = payload.amount
    expense.transactionDate = DateTime.fromJSDate(payload.transactionDate)
    expense.categoryId = payload.categoryId

    const image = request.file('image', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (image) {
      await image.move(Application.publicPath('uploads'), {
        name: `${new Date().getTime()}.${image.extname}`,
        overwrite: true,
      })
      expense.imagePath = image.fileName!
    }

    await expense.save()
    response.redirect('/expenses')
  }

  async destroy({ params, response }: HttpContext) {
    const expense = await Expense.findOrFail(params.id)
    await expense.delete()
    response.redirect('/expenses')
  }

  async getAllExpenses({ response }: HttpContext) {
    const expenses = await Expense.query().preload('category')
    return response.json(expenses)
  }
}
