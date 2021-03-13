const { Controller, Mapping } = require('@annotation')

@Controller('/v1/book')
class BookController {

  @Mapping
  static async name() {
    return {
      name: 'bookName is hahaha'
    }
  }
}

module.exports = { BookController }
