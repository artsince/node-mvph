module.exports = function (mongoose) {
    'use strict';

    var MemberStatuses = {
        NotFound: 1,
        MissingPhoto: 2,
        NoProblem: 3
    };

    var MemberSchema = new mongoose.Schema({
        regNo: {type: Number, unique: true, required: true},
        photo: {type: Buffer, required: false},
        missing: {type: Boolean, required: true}
    });

    var Member = mongoose.model('Member', MemberSchema);

    var _addMemberWithPhoto = function (regNo, photo, callback) {
        var member = new Member({
            regNo: regNo,
            photo: photo,
            missing: false
        });

        member.save(function (err) {
            if(callback) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        });
    };

    var _addMemberWithoutPhoto = function (regNo, callback) {
        var member = new Member({
            regNo: regNo,
            photo: null,
            missing: true
        });

        member.save(function (err) {
            if(callback) {
                if(err) {
                    callback(err);
                } else {
                    callback(null);
                }
            }
        });
    };

    var _retrievePhoto = function (regNo, callback) {
        Member.findOne({regNo: regNo}, function (err, member) {
            if(err) {
                callback(err);
                return;
            }

            if(!member) {
                callback(null, MemberStatuses.NotFound);
            }
            else {
                if(member.missing) {
                    callback(null, MemberStatuses.MissingPhoto);
                }
                else {
                    callback(null, MemberStatuses.NoProblem, member.photo);
                }
            }
        });
    };

    return {
        addMemberWithPhoto:_addMemberWithPhoto,
        addMemberWithoutPhoto: _addMemberWithoutPhoto,
        retrievePhoto: _retrievePhoto,
        Status: MemberStatuses
    };
};