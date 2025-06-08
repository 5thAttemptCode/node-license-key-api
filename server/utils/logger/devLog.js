// Only log detailed errors in development
function devLog(...args){
  if(process.env.NODE_ENV = development){
    console.log(...args)
  }
}

module.export = devLog