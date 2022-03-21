let ATCheckBlackListRegex = /^查云黑/; //查绑定正则检索
let BlackListLink = "https://api.blackbe.xyz/openapi/v3/check/?"; //云黑API

function reply(e) {
    if (e.group_id != NIL.CONFIG.GROUP_MAIN) return; //检测是否为NilBridge设置群聊
    if (ATCheckBlackListRegex.test(e.raw_message)) {
        let CheckBlackData = e.raw_message.replace('查云黑', '');
        let QQRegex = Number(CheckBlackData);
        if (!isNaN(QQRegex)) { //XBOXID中不允许全数字因此可以用来区别QQ号及XBOXID
            var CheckBlackBELink = BlackListLink + 'qq=' + CheckBlackData;
            var Identity = "QQ";
        } else {
            var CheckBlackBELink = BlackListLink + 'name=' + CheckBlackData;
            var Identity = "玩家";
        }
        let CheackBlackData = NIL.TOOL.HttpGetSync(CheckBlackBELink);
        let BlackDataJson = JSON.parse(CheackBlackData);
        if (!BlackDataJson.status) { //云黑API检测
            e.reply("云黑检查错误，错误码：" + BlackDataJson.status);
        } else {
            if (BlackDataJson.status == 2000) { //库来源检查
                if (BlackDataJson.data.info[0].black_id == 1) {
                    var LibrarySource = "云黑公开库";
                } else {
                    var LibrarySource = "私有库"; //这里是我做着留给自己用的，可以删除
                }
                e.reply("玩家 " + BlackDataJson.data.info[0].name + " 已被封禁\n玩家QQ:" + BlackDataJson.data.info[0].qq + "\n违规等级:" + BlackDataJson.data.info[0].level + "\n违规信息:" + BlackDataJson.data.info[0].info + "\n库来源:" + LibrarySource);
            } else {
                e.reply(Identity + ":" + CheckBlackData + "\n未位于云黑当中");
            }
        }
        return;
    }
}

function log(a) {
    NIL.Logger.info('BlackBE', a);
} //log输出格式

function onStart() {
    NIL.FUNC.PLUGINS.GROUP.push(reply);
    log('BlackBE');
} //加载

function onStop() {
    log('插件已卸载');
} //卸载

module.exports = {
    onStart,
    onStop
}; //插件安装

// {
//     "success": true,
//     "status": 2000,
//     "message": "查到了DeSu",
//     "version": "v3.1",
//     "codename": "Moriya Suwako",
//     "time": 1644934343,
//     "data": {
//       "exist": true, //玩家信息是否存在于云黑名单
//       "info": [
//           {
//               "uuid": "323c1261-76b6-44c8-bdba-bfeab250fee4", //条目UUID
//               "name": "blackbetest", //违规玩家ID
//               "black_id": "1", //条目所属云黑库，1为公开库，私有库则为私有库的UUID
//               "xuid": "2535424045177658", //玩家XUID
//               "info": "开发者测试账号", //玩家违规信息
//               "level": 1, //违规等级
//               "qq": 11030503, //玩家QQ
//               "photos": [
//                   "api.blackbe.xyz/assets/images/blackbe/public/blackbetest/16449339730.png",
//                   "api.blackbe.xyz/assets/images/blackbe/public/blackbetest/16449339731.png",
//                   "api.blackbe.xyz/assets/images/blackbe/public/blackbetest/16449339732.png"
//               ] //证据图片
//           },
//           {
//               "uuid": "f6b876a6-1ee1-47cb-87bc-e54dd5b310fd",
//               "name": "TestPlayer",
//               "black_id": "2b39814e-43f4-4921-af77-83cdb955e783",
//               "xuid": "2535424045177658",
//               "info": "测试啦测试",
//               "level": 1,
//               "qq": 1012140043,
//               "photos": null
//           }
//       ]
//     }
//   }