function IfOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function JavaScriptOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function LoadSegOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function NullOp(t,e){this.dostring=t.trim(),this.nodetarget=e}function PrintOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function SegmentByOp(t,e){this.augmentstring=t.trim(),this.nodetarget=e,this.id=e.id
var n=/\s+(setas\s+{{[^\}]+}})\s*$/g
if((_sp=this.augmentstring.search(n))>0){console.log("***"+_sp)
var r=this.augmentstring.match(n)[0]
r=r.trim(),r=r.split(/\s+/),r=r[r.length-1],0==r.indexOf("{{")&&(r=r.substr(2,r.length-4).trim()),this.setas=r.trim(),console.log("-->"+this.setas),this.augmentstring=this.augmentstring.replace(n,""),t=this.augmentstring}if(console.log(t),console.log(this.augmentstring),-1!=t.indexOf("mostlikely"))this.mop="mostLikely",this.pvarb=t.substr(t.indexOf(" ",t.indexOf("mostlikely")+1)+1)
else{var i=t.split(/\s+/)
i.shift()
if(this.pvarb=this.cleanVarb(i.shift()),this.mop="unique",i.length>0&&(this.mop=i.shift()),this.mcrit=void 0,i.length>0&&(this.mcrit=i.join(" ")),this.segkey=this.mcrit,this.segname=window._lastseg,void 0===this.segkey)this.segkey=""
else if(0==this.segkey.indexOf("{{")&&(this.segkey=this.segkey.substr(2,this.segkey.length-4).trim()),-1!=this.segkey.indexOf(".")){var o=/(\S+)\.(.*)/,s=o.exec(this.segkey)
this.segname=s[1],this.segkey=s[2]}}}function mostLikely(t,e){return tempseg=pSegmentBuilder(t,e),0!=tempseg.length?(best=tempseg[tempseg.length-1],best.y>0?[best.x,best.y]:void 0):void 0}function unique(t,e,n,r){return t[e]}function matches(t,e,n,i){var o=person[e]
"object"==typeof o&&(o=o.toString())
var s=window[n],a=i
for(r in s){row=s[r]
var c=row[a]
if("object"==typeof c&&(c=c.toString()),o==c)return combine(person,row),void 0!==s.segmentname?row.segmentname:row[a]}}function nearestGeo(t,e,n,i){var o=person[e],s=window[n],a=2e15,c=void 0
for(r in s)try{row=s[r]
var d=row[i]
_dist=GeoDistanceSimilarity(o,d),_dist<a&&(a=_dist,c=row)}catch(u){}return void 0!==c?(combine(person,c),void 0!==s.segmentname?[c.segmentname,a]:[c[i],a]):void 0}function combine(t,e){for(var n in e)t[n]=e[n]}function GeoDistanceSimilarity(t,e){return lat=1,lon=0,GeoDistance(t[lat],t[lon],e[lat],e[lon],"K")}function distanceTo(t,e){return lat=1,lon=0,p2=e.split(/\,/),console.log(t+" "+p2),GeoDistance(t[lat],t[lon],p2[lat],p2[lon],"K")}function GeoDistance(t,e,n,r,i){var o=Math.PI*t/180,s=Math.PI*n/180,a=(Math.PI*e/180,Math.PI*r/180,e-r),c=Math.PI*a/180,d=Math.sin(o)*Math.sin(s)+Math.cos(o)*Math.cos(s)*Math.cos(c)
return d=Math.acos(d),d=180*d/Math.PI,d=60*d*1.1515,"K"==i&&(d=1.609344*d),"N"==i&&(d=.8684*d),d}function ComparitiveDistanceOrSimilarity(t,e){return Math.abs(t-e)}function pSum(t){return 0==t.length?0:1==t.length?t[0].y:t.reduce(pSumF)}function pSumF(t,e){return"number"!=typeof t&&(t=t.y),"number"!=typeof e&&(e=e.y),t+e}function pInRange(t){return min=this[0],max=this[1],max<min&&(min=this[1],max=this[0]),t.x>=min&&t.x<=max}function pSort(t,e){return t.y<e.y?-1:t.y>e.y?1:0}function pGreater(t){return min=this,t.x>=min}function pLesser(t){return max=this,t.x<=max}function pContains(t){return approved=Array.from(this),-1!=approved.indexOf(t.x)}function pSegmentParser(t,e){0==e.indexOf("{{")&&(e=e.substr(2,e.length-4).trim())
var n=/([^\|]+)/g,r=e.match(n)
if(e=r[0].trim(),condition=r[1].trim(),distrib=t[e+".distrib"],void 0===distrib||0==distrib.length)return 0
if(filtered_d=[],-1!=condition.search(/\<\s*([0-9]+)/g)){r=condition.match(/(\d+)/)
var i=parseInt(r[0])
filtered_d=distrib.filter(pLesser,i)}else if(-1!=condition.search(/\>\s*([0-9]+)/g)){r=condition.match(/(\d+)/)
var i=parseInt(r[0])
filtered_d=distrib.filter(pGreater,i)}else if(-1!=condition.search(/([0-9]+)\s*\-\s*([0-9]+)/g)){r=condition.match(/(\d+)/g)
var i=parseInt(r[0]),o=parseInt(r[1])
filtered_d=distrib.filter(pInRange,[i,o])}else{var s=[].concat.apply([],condition.split('"').map(function(t,e){return e%2?""+t:t.split(" ")})).filter(Boolean)
filtered_d=distrib.filter(pContains,s)}return pSum(filtered_d)}function pSegmentBuilder(t,e){for(_rules=e.split("||"),toret=[],z=0;z<_rules.length;z++){var n=_rules[z].trim()
0==n.indexOf("{{")&&(n=n.substr(2,n.length-4).trim())
var r=n.replace(/\s+/g,""),i=pSegmentParser(t,n)
toret.push({x:r,y:i})}return toret.sort(pSort)}function SetOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function VisOp(t,e){this.dostring=t.trim()
var n=/(\S+)\s(.*)/
match=n.exec(t),this.func=match[1],this.rest=match[2],this.nodetarget=e}function loadSegment(t,e){return window._lastseg=e,"undefined"==typeof window[e]&&(window[e]=loadCSV(t)),window[e]}function getSegments(t){if(toret=[],void 0===t.__SEGMENTS)return toret
for(k in t.__SEGMENTS)-1==k.indexOf("dist")&&toret.push(t.__SEGMENTS[k])
return toret}function loadSegmentText(t,e){return window._lastseg=e,"undefined"==typeof window[e]&&(window[e]=loadTextCSV(t)),window[e]}function loadTextCSV(t){var e=Papa.parse(t,{header:!0})
for(_z in e.data[0])_z.startsWith("geoloc")&&fixGeo(e.data,_z)
return e.data}function loadCSV(t){var e=new XMLHttpRequest
e.open("GET",t,!1),e.send(null)
var n=void 0
if(200!==e.status)return void(debugmode&&console.log("unable to load csv file"))
n=e.responseText
var r=Papa.parse(n,{header:!0})
for(_z in r.data[0])_z.startsWith("geoloc")&&fixGeo(r.data,_z)
return r.data}function fixGeo(t,e){for(i=0;i<t.length;i++)try{var n=t[i][e],r=n.split(",")
r=r.map(parseFloat),t[i][e]=r}catch(o){}}function findBlocks(t){t=t.replace(/^persalog/i,""),lines=t.split(/\n|\r/),buffer=[],clctr=[]
for(i in lines)line=lines[i].trim(),0==line.length?buffer.length>0&&(clctr.push(buffer),buffer=[]):buffer.push(line)
return buffer.length>0&&(clctr.push(buffer),buffer=[]),clctr}function findParams(t){var e=/\{{2}\s*([^\}]+)\s*\}{2}/g,n=t.match(e),r=[],i={}
for(z in n)mtch=n[z],mtch in i||(i[mtch]=1,r.push(mtch.substr(2,mtch.length-4).trim()))
return r}function addSegment(t,e,n,r){"undefined"==typeof r&&(r=void 0),"__SEGMENTS"in t||(t.__SEGMENTS={}),"__SEGMENT"in t||(t.__SEGMENT=""),"object"==typeof n?(t.__SEGMENTS[e]=n[0],t.__SEGMENTS[e+"_dist"]=n[1],t.__SEGMENT+=n[0]+"|",void 0!==r&&(t[r]=n[0],t[r+"_dist"]=n[1])):(void 0!==r&&(t[r]=n),t.__SEGMENTS[e]=n,t.__SEGMENT+=n+"|")}function inSegment(t,e){return _segs=getSegments(t),_segs.includes(e)}function parseIfString(t){_chars=Array.from(t),_output=new Array
var e=0
for(e=0;e<_chars.length;e++){var n=e
e=parseInter(_chars,0,_output),e-=1,n>e&&(e=n)}return _output.join("")}function doSomething(t){str=t.join(""),str=printHelperTransform(str)
var e=[].concat.apply([],str.split('"').map(function(t,e){return e%2?'"'+t+'"':t.split(" ")})).filter(Boolean)
for(k=0;k<e.length;k++)"is"==e[k]?"defined"==e[k+1]?(e[k]="!==",e[k+1]="undefined"):"undefined"==e[k+1]?e[k]="===":e[k]="==":"startsWith"==e[k]?(e[k]=".startsWith(",e[k+1]=e[k+1]+")"):"endsWith"==e[k]?(e[k]=".endsWith(",e[k+1]=e[k+1]+")"):"contains"==e[k]?(e[k]=".search(",e[k+1]=e[k+1]+") != -1"):"insegment"==e[k]?(e[k]="inSegment(p,",e[k+1]=e[k+1]+")"):"distanceTo"==e[k]&&(e[k-1]="distanceTo("+e[k-1]+",",e[k]="",e[k+1]="'"+e[k+1]+"')")
var n=e.join(" ")
return Array.from(n)}function parseInter(t,e,n){var r=0,i=new Array,o=!1
for(r=e;r<t.length;r++)if("("!=t[r]||o){if(")"==t[r]&&!o)return i.length>0&&(n.push.apply(n,doSomething(i)),i=new Array),n.push(")"),r+1
'"'==t[r]&&(o=!o),i.push(t[r])}else{i.length>0&&(n.push.apply(n,doSomething(i)),i=new Array),n.push("(")
var s=r
r=parseInter(t,r+1,n),r-=1,s>r&&(r=s)}return i.length>0&&(n.push.apply(n,doSomething(i)),i=new Array),r+1}function blockProcessor(t,e,n,r){"undefined"!=typeof r&&1==r&&(n=document.createElement("span"),n.id="nop",document.head.appendChild(n)),toRet="function persalogBlock"+e+"(p,t) {\n",toRet+="	try {\n",toRet+='		if (typeof t === "undefined") {\n',toRet+="			t = document.getElementById('"+n.id+"');\n",toRet+="		}\n",isDef=!1
var o=void 0
for(i=0;i<t.length;i++){for(line=t[i].toString(),chunks=line.split(/\s*:::\s*/),console.log(i+" "+chunks),conds=[],actions=[],seenSeg=!1,j=0;j<chunks.length;j++)for(chunk=chunks[j],cmd=chunks.shift();void 0!=cmd;)Op=null,cmd.startsWith("print")?Op=new PrintOp(cmd,n):cmd.startsWith("vis")?Op=new VisOp(cmd,n):cmd.startsWith("set")?Op=new SetOp(cmd,n):cmd.startsWith("if")?Op=new IfOp(cmd,n):cmd.startsWith("default")?isDef=!0:cmd.startsWith("loadsegment")?Op=new LoadSegOp(cmd,n):cmd.startsWith("donothing")?Op=new NullOp(cmd,n):cmd.startsWith("js")?Op=new JavaScriptOp(cmd,n):cmd.startsWith("segmentby")&&(Op=new SegmentByOp(cmd,n)),null!=Op&&(Op instanceof IfOp?conds.push(Op.toString()):Op instanceof SegmentByOp?(conds.push(Op.getIfString()),actions.push(Op.toString())):actions.push(Op.toString())),cmd=chunks.shift()
for(boolString="",0==conds.length?boolString="(true)":boolString=conds.join(" && "),0==i?toRet+="		if ("+boolString+") {\n":i==t.length-1&&isDef?toRet+="		else {\n":toRet+="		else if ("+boolString+") {\n",k=0;k<actions.length;k++)toRet+="			"+actions[k]+"\n",isDef&&(void 0===o&&(o=""),o+="			"+actions[k]+"\n"),-1!=actions[k].indexOf("addSegment")&&(seenSeg=!0)
seenSeg||(toRet+="			addSegment(p,'"+e+"','seg"+e+"."+i+"');\n",isDef&&(void 0===o&&(o=""),o+="			addSegment(p,'"+e+"','seg"+e+"."+i+"');\n")),toRet+="		}\n"}return toRet+="	 } catch(_perr) {\n		console.error(_perr)\n",void 0===o?toRet+="		throw(_perr);\n			console.error(_perr)\n":toRet+=o,toRet+="	}\n",toRet+="	return(p);\n",toRet+="}",toRet}function p2javascript(t,e){if("undefined"==typeof e&&(e="p"),-1!=t.indexOf("{{")&&(t=t.substr(2,t.length-4).trim()),-1!=t.indexOf("."))var n=/(\S+)\.(.*)/,r=n.exec(t),e=r[1],t=r[2]
return e+"['"+t+"']"}function printHelperSprintf(t){var e=/\{{2}\s*((\w|\.)+)\s*\}{2}/g,n=t.replace(e,function(t,e){return"%("+e+")s"})
return n.startsWith("'")||toRet.startsWith('"')?"sprintf("+n+",p)":"sprintf('"+n+"',p)"}function printHelperTransform(t,e){"undefined"==typeof e&&(e="p")
var n=/\{{2}\s*((\w|\.)+)\s*\}{2}/g,r=t.replace(n,function(t,n){return p2javascript(n,e)})
return r}function escapeQuotes(t){return t.replace(/\\([\s\S])|(["|'])/g,"\\$1$2")}function addCBlock(t,e){id=e.max,void 0===id?id=0:id+=1,"string"==typeof t&&(console.log("making string into comment"),t=document.createComment(t)),e["source-"+id]=t,e["personalized-"+id]=void 0
var n=t.nodeValue.trim(),r=/PersaLog([^\n|\r]+)/g,i=r.exec(n)
console.log("**** "+i)
var o=null
if(null!=i)try{var s=i[i.length-1]
if(console.log("--"+s+"--"),console.log(typeof s),o=document.getElementById(s.trim()),null!=o){for(;o.firstChild;)o.removeChild(o.firstChild)
var a=document.createTextNode("")
o.appendChild(a),console.log("all good")}else console.error("can't find existing "+i[0].trim())}catch(c){console.error("can't find existing "+i[0].trim()+" "+c)}if(null==o){o=document.createElement("span"),o.setAttribute("id","personal-"+id)
var a=document.createTextNode("")
o.appendChild(a)
var d=t.parentNode
d.insertBefore(o,t)}for(o.setAttribute("class","doubleUnderline"),e["personalized-"+id]=o,e.max=id,blcks=findBlocks(t.nodeValue.trim()),runner=[],z=0;z<blcks.length;z++)blck=blcks[z],code=blockProcessor(blck,id+"_"+z,o),console.log(code),window.eval(code),runner.push("persalogBlock"+id+"_"+z)
e["blocks-"+id]=runner,console.log(runner),o.setAttribute("data-title","personalized by PersaLog, using: "+paramString(findParams(t.nodeValue.trim()))),id+=1}function getLastScriptID(t){return t.max}function deleteScriptID(t,e){delete t["personalized-"+e],delete t["source-"+e],delete t["blocks-"+e]}IfOp.prototype={constructor:IfOp,toString:function(){try{return toout=this.rest,"("+parseIfString(toout)+")"}catch(t){return"console.error('"+escapeQuotes("Ill formed if op "+this.dostring+" -- "+t)+"');"}}},JavaScriptOp.prototype={constructor:JavaScriptOp,toString:function(){try{var t=/(\S+)\s*(.*)/,e=t.exec(this.rest),n=e[1],r=e[2],i=printHelperSprintf(r)
""!=i&&(i=","+i)
var o="if (typeof window['"+n+"'] === \"function\") {window['"+n+"'](person,"+i+");}\n"
return o+="		persalogEval('"+n+"',"+i+");"}catch(s){return"console.error('Ill formed vis operation: "+escapeQuotes(this.rest)+"')"}}}
var persalogEval=function(t,e){}
LoadSegOp.prototype={constructor:LoadSegOp,toString:function(){try{var t=/(\S+)\s*(.*)/,e=t.exec(this.rest),n=e[1],r=e[2]
return""===r&&(r=n.substring(n.lastIndexOf("/")+1),r=r.replace(/\..+$/,"")),window._lastseg=r,"loadSegment('"+n+"','"+escapeQuotes(r)+"')"}catch(i){return"console.error('"+escapeQuotes("Ill formed segment load operation: "+this.dostring+" -- "+i)+"');"}}},NullOp.prototype={constructor:NullOp,toString:function(){return"true;"}},PrintOp.prototype={constructor:PrintOp,toString:function(){return"document.getElementById(t.id).innerHTML = "+printHelperSprintf(escapeQuotes(this.rest))+";"}},SegmentByOp.prototype={constructor:SegmentByOp,toString:function(){try{var t=""
return void 0!==this.setas&&(console.log("ex: "+this.setas),t=",'"+this.setas+"'"),"unique"==this.mop?"addSegment(p,'seg_"+this.id+".unique',_seg"+t+");":"mostLikely"==this.mop?"addSegment(p,'seg_"+this.id+".mostlikely',_seg"+t+");":"addSegment(p,'seg_"+this.id+"."+this.segname+"',_seg"+t+");"}catch(e){return"console.error('Ill formed set operation: "+escapeQuotes(this.rest+" -- "+e)+"')"}},cleanVarb:function(t){var e=/\{{2}\s*/g
return t=t.replace(e,""),e=/\s*\}{2}/g,t=t.replace(e,"")},getIfString:function(){try{return"mostLikely"==this.mop?"(_seg = "+this.mop+"(p,'"+this.pvarb+"')) !== undefined":"(_seg = "+this.mop+"(p,'"+this.pvarb+"','"+this.segname+"','"+this.segkey+"')) !== undefined"}catch(t){return console.error(t),"false"}}},SetOp.prototype={constructor:SetOp,toString:function(){try{var t=/(\S+)\s+(\S+)\s+(.*)/,e=t.exec(this.rest),n=e[1],r=e[2],i=e[3]
return"to"!=r?"console.error('Ill formed set operation: "+escapeQuotes(this.rest+" -- "+o)+"')":((i.startsWith("'")||i.startsWith('"'))&&(i=i.substr(1,i.length-2)),p2javascript(n)+" = '"+escapeQuotes(i)+"';")}catch(o){return"console.error('Ill formed set operation: "+escapeQuotes(this.rest+" -- "+o)+"')"}}},VisOp.prototype={constructor:VisOp,toString:function(){try{var t=/(\S+)\s*(.*)/,e=t.exec(this.rest),n=e[1],r=e[2],i=printHelperSprintf(r),o="if (typeof window['"+n+"'] === \"function\") {window['"+n+"']("+i+");}\n"
return o+="		personalizeVisIframes('"+n+"',"+i+");"}catch(s){return"console.error('Ill formed vis operation: "+escapeQuotes(this.rest)+"')"}}}
var personalizeVisIframes=function(t,e){var n,r=document.getElementsByClassName("PersalogIF")
for(n=0;n<r.length;n++)personalizeVizIframe(r[n],t,e)},personalizeVizIframe=function(t,e,n){if(void 0!=t&&void 0!=t.contentWindow&&void 0!=t.contentWindow.mystate){var r=t.contentWindow.mystate
if("complete"===r){for("null"!=e&&"function"==typeof t.contentWindow[e]&&t.contentWindow[e](n),i=0;i<t.contentWindow.length;i++);return void autoResize(t)}window.setTimeout(function(){personalizeVizIframe(t,e,n)},100)}else window.setTimeout(function(){personalizeVizIframe(t,e,n)},100)},autoResize=function(t){"string"==typeof t&&(t=document.getElementById(t))
var e=t.contentWindow.document.getElementById("viswindow").scrollHeight+10,n=t.contentWindow.document.getElementById("viswindow").scrollWidth+10
t.height=e+"px",t.width=n+"px"}
debugmode=!1
var codePerson=function(t){return t=codeIP(t),t=codeGeo(t)},codeIP=function(t){window.XMLHttpRequest?request=new XMLHttpRequest:request=new ActiveXObject("Microsoft.XMLHTTP"),request.open("POST","/getIP/",!1),request.setRequestHeader("Content-Type","application/json;charset=UTF-8"),request.send(JSON.stringify(t))
var e=void 0
if(200==request.status){console.log(request.responseText),e=JSON.parse(request.responseText)
for(z in e)t[z]=e[z]}return t},codeGeo=function(t){window.XMLHttpRequest?request=new XMLHttpRequest:request=new ActiveXObject("Microsoft.XMLHTTP"),console.log("getting"),request.open("POST","/geoCodeIP",!1),request.setRequestHeader("Content-Type","application/json;charset=UTF-8"),request.send(JSON.stringify(t))
var e=void 0
if(200==request.status){e=JSON.parse(request.responseText)
for(z in e)t[z]=e[z]}return t},findComments=function(t){for(var e=[],n=0;n<t.childNodes.length;n++){var r=t.childNodes[n]
8===r.nodeType?(nv=r.nodeValue.trim(),nv.startsWith("PersaLog")&&e.push(r)):e.push.apply(e,findComments(r))}return e},setupDocument=function(){arr=findComments(document)
var t={max:-1}
for(c in arr)console.log(arr[c]),addCBlock(arr[c],t)
return t},runall=function(t,e){var n=t.max
for(id=0;id<=n;id++)if(void 0!==t["personalized-"+id])for(t["personalized-"+id].innerHTML="",scr=t["blocks-"+id],s=0;s<scr.length;s++)if("function"==typeof window[scr[s]])try{window[scr[s]](e)}catch(r){console.error("failed: "+r)}},paramString=function(t){return 0==t.length?"No specific personal attributes":t.join()}
