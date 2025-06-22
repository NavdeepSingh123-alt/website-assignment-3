// import type { HttpContext } from '@adonisjs/core/http'

// export default class MethodOverride {
//   public async handle({ request }: HttpContext, next: () => Promise<void>) {
//     if (request.method() === 'POST' && request.input('_method')) {
//       request.request.method = request.input('_method').toUpperCase()
//     }
//     await next()
//   }
// }

export default class MethodOverride {
  public async handle(ctx: any, next: () => Promise<void>) {
    const { request } = ctx

    console.log('Original Method:', request.method(), '| Override Value:', request.input('_method'))

    if (request.method() === 'POST' && request.input('_method')) {
      request.request.method = request.input('_method').toUpperCase()
      console.log('Overridden To:', request.request.method)
    }

    await next()
  }
}