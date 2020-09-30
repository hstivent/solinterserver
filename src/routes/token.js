var jwt = require('jwt-simple')


function createToken(obj){
  
  var secret  = toString(obj.serie)
  var payload = { 
        serie:obj.serie, 
        user:obj.name, 
      }
    // encode
    var token = jwt.encode(payload, secret)
    return token
    // console.log('token: '+token)
    
    // // decode
    // var decoded = jwt.decode(token, secret)
    // console.log('decode: '+JSON.stringify(decoded)) //=> { foo: 'bar' }

  }  


// function decodeToken (token)
// {
//     var decoded = jwt.decode(token, secret);
// }

module.exports = 
{ 
    createToken
    // decodeToken
}