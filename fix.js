const fs=require("fs");
let s=fs.readFileSync("app/page.js","utf8");
const old='{!isSubscribed&&<div style={{fontSize:12,color:quizzesUsed>=FREE_QUIZ_LIMIT-1?C.amber||C.textMuted:C.textDim,marginTop:8}}>{FREE_QUIZ_LIMIT-quizzesUsed>0?(FREE_QUIZ_LIMIT-quizzesUsed)+" free quiz"+(FREE_QUIZ_LIMIT-quizzesUsed===1?"":"zes")+" remaining":"Subscribe to continue"}</div>}';
const n=(s.split(old).length-1);
console.log("Found",n,"instances");
if(n>=2){
  const i=s.indexOf(old);
  const j=s.indexOf(old,i+old.length);
  s=s.substring(0,j)+s.substring(j+old.length);
  const b='{!isSubscribed&&<div style={{marginTop:16,padding:"12px 20px",background:"rgba(200,164,110,0.08)",border:"1px solid rgba(200,164,110,0.2)",borderRadius:10,maxWidth:320,textAlign:"center"}}><div style={{fontSize:14,fontWeight:600,color:"#c8a46e",marginBottom:4}}>{FREE_QUIZ_LIMIT-quizzesUsed>0?(FREE_QUIZ_LIMIT-quizzesUsed)+" free quiz"+(FREE_QUIZ_LIMIT-quizzesUsed===1?"":"zes")+" remaining":"Free quizzes used"}</div><div style={{fontSize:11,color:C.textMuted}}>Subscribe for unlimited quizzes</div></div>}';
  s=s.replace(old,b);
  fs.writeFileSync("app/page.js",s);
  console.log("Done!");
}else{console.log("Count:",n);}
