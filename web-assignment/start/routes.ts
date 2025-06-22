import router from '@adonisjs/core/services/router'
import CategoriesController from '#controllers/categories_controller'
import ExpensesController from '#controllers/expenses_controller'
import SessionController from '#controllers/session_controller'
import { middleware } from './kernel.js'

router.get('/', [ExpensesController, 'index']).use(middleware.auth())

router.on('/login').render('pages/login')
router.post('/login', [SessionController, 'store'])
router.post('/logout', [SessionController, 'destroy']).use(middleware.auth())

router.resource('categories', CategoriesController).use('*', middleware.auth())
router.resource('expenses', ExpensesController).use('*', middleware.auth())

router.get('/api/products', [ExpensesController, 'getAllExpenses'])
router.get('/api/categories', [CategoriesController, 'getAllCategorys'])

router.get('/home', async ({ view }) => view.render('pages/home')).use(middleware.auth())
