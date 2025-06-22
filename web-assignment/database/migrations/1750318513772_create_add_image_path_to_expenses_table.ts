import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddImagePathToExpenses extends BaseSchema {
  protected tableName = 'expenses'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('image_path').nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image_path')
    })
  }
}
