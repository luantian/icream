

function Controller( prefix = '' ) {

  return function (target, key, description) {
    console.log("target:", target)
    console.log("key:", key)
    console.log("description:", description)
    return description
  }
}

function Mapping( docPath = '', docDirPath = '' ) {
  const apiDirectory = `${process.cwd()}/static/doc/`
  console.log('apiDirectory', apiDirectory)
  return function (target, key, description) {
    console.log("Mappingtarget:", target)
    console.log("Mappingkey:", key)
    console.log("Mappingdescription:", description)
    return description
  }
}

function Validate() {

  return function (target, key, description) {

    return description

  }

}


module.exports = { Controller, Validate, Mapping }