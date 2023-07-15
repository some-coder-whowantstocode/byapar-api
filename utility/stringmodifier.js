const stringmodifier = (base64)=>{


    if(base64[5] != ':'){
      base64 = base64.slice(4);
      let data = 'data:';
      base64 = data.concat(base64)
    }
   let n=Number( base64.search('base64'))


   let b;
  if(base64[n-1]!=';'){
    b = base64.slice(0,n)
    base64 = base64.slice(n)
    base64 = b.concat(';',base64);
  }
  
   n = base64.search('4')
   if(base64[n+1]!=','){
    b=base64;
    base64 = base64.slice(0,n+1);
    b = b.slice(n+1);
    base64 = base64.concat(',',b)
   }
    let length = base64.length;
 if(base64.charAt(length-1) == base64.charAt(length-2)){
  base64 = base64.slice(0,length-1)
 }
 n = base64.search('=');
 base64=base64.slice(0,n)

   return base64;
}


module.exports = {
    stringmodifier
}