const crypto = require('crypto')

const st1 = 'Optimizand seguridad @@##.,-Málaga'
const st2 = 'Refresh token purpose @@##.,-Málaga'
const str = 'e*LkPQ6E@$<E$;[%*bRY'

const hash = crypto.createHmac('sha256',st1).update(str).digest('hex')
const hash2 = crypto.createHmac('sha256',st2).update(str).digest('hex')

console.log("Hash primario:",hash)
console.log("Hash secundario:",hash2)