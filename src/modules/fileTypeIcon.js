const map=new Map()
const w='word'
map.set('application/msword',w)
map.set('application/vnd.openxmlformats-officedocument.wordprocessingml.document',w)
map.set('application/vnd.openxmlformats-officedocument.wordprocessingml.template',w)
map.set('application/vnd.ms-word.document.macroEnabled.12',w)
map.set('application/vnd.ms-word.template.macroEnabled.12',w)

const x='excel'
map.set('application/x-xls',x)
map.set('application/vnd.ms-excel',x)
map.set('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',x)
map.set('application/vnd.openxmlformats-officedocument.spreadsheetml.template',x)
map.set('application/vnd.ms-excel.sheet.macroEnabled.12',x)
map.set('application/vnd.ms-excel.template.macroEnabled.12',x)
map.set('application/vnd.ms-excel.addin.macroEnabled.12',x)
map.set('application/vnd.ms-excel.sheet.binary.macroEnabled.12',x)

const p='ppt'
map.set('application/vnd.ms-powerpoint',x)
map.set('application/vnd.openxmlformats-officedocument.presentationml.presentation',x)
map.set('application/vnd.openxmlformats-officedocument.presentationml.template',x)
map.set('application/vnd.openxmlformats-officedocument.presentationml.slideshow',x)
map.set('application/vnd.ms-powerpoint.addin.macroEnabled.12',x)
map.set('application/vnd.ms-powerpoint.presentation.macroEnabled.12',x)
map.set('application/vnd.ms-powerpoint.slideshow.macroEnabled.12',x)

const z='zip'
map.set('application/zip',z)
map.set('application/gzip',z)

const js='js'
map.set('application/ecmascript',js)
map.set('application/javascript',js)

const png='image'
map.set('application/x-png',png)
map.set('image/gif',png)
map.set('image/jpeg',png)
map.set('image/png',png)
map.set('image/x-icon',png)
map.set('image/vnd.microsoft.icon',png) 

const video='video'
map.set('video/webm',video)
map.set('video/ogg',video)


const music='music'
map.set('audio/midi',music)
map.set('audio/mpeg',music)
map.set('audio/webm',music)
map.set('audio/ogg',music)
map.set('audio/wav',music)

const txt='txt'
map.set('text/plain',txt)


function typeChangeIcon(type){
    let icon=map.get(type)
    return icon?icon:'unknow'
}

export default{
    typeChangeIcon
}

