
bz.help.makeNamespace('bz.bus.invitationCodes');
bz.bus.invitationCodes.getCodeAlias = function(data){
    var code = data && data._id;
    if (code) {
        code = code.toLowerCase().substr(0, 4);
    } else {
        code = null;

    }
    return code;
}

bz.bus.invitationCodes.findCodeByAlias = function(code){
    var code = bz.cols.invitationCodes.findOne({ _id: code }); // todo
    return code;
}