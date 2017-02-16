(function () {

    var _ = require('underscore');

    //公共函数
    function Common() {
    }

    Common.prototype.invokecallback = function () {
        if (arguments.length > 0) {
            if (typeof(arguments[0]) === 'function')
                arguments[0].apply(null, Array.prototype.slice.call(arguments, 1));
            else if (typeof arguments[1] === 'function')
                arguments[1].apply(arguments[0], Array.prototype.slice.call(arguments, 2));
        }
    };

    Common.prototype.invokeapply = function () {
        if (arguments.length > 0) {
            if (typeof(arguments[0]) === 'function') {
                var arg = Array.prototype.slice.call(arguments[1], 0);
                if (Array.isArray(arg))
                    arguments[0].apply(null, arg);
            } else if (typeof arguments[1] === 'function') {
                var arg = Array.prototype.slice.call(arguments[2], 0);
                if (Array.isArray(arg))
                    arguments[1].apply(arguments[0], arg);
            }
        }
    };

    /**
     * 删除数组中所符合给予的值
     * @param array数组
     * @param  value 需要删除的对象
     * @param  all 若true，将删除数据组中所有符合给予的值，false只删除找到的第一个
     */
    Common.prototype.array_remove = function (array, value, all) {
        for (var index = array.length; index >= 0; index--)
            if (_.isEqual(array[index], value)) {
                array.splice(index, 1);
                if (all !== true)
                    break;
            }
        return array;
    };

    /**
     * 所给予的值，返回人类可以读的档案大小
     * @param(int) bytes 大小数值值
     * @param(boolean) IEC模式或SI模式（预设为SI）
     * @return(string) 返回人类可读档案大小字串
     */
    Common.prototype.getfilesize = function (bytes, iec) {
        iec = !!iec;
        bytes = this.tonumber(bytes);
        var thresh = iec ? 1024 : 1000;
        if (Math.abs(bytes) < thresh)
            return bytes + ' B';
        var units = iec
            ? ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
            : ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    };

    Common.prototype.now = function () {
        var now = new Date();
        return now.getFullYear() + '-' +
            (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '-' +
            (now.getDate() < 10 ? '0' : '') + now.getDate() + ' ' +
            (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' +
            (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ':' +
            (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
    };

    Common.prototype.time = function (milisecond) {
        if (milisecond)
            return new Date().getTime();
        else
            return Math.floor(new Date().getTime() / 1000);
    };

    Common.prototype.random = function (min, max) {
        if (typeof(min) === 'number' && typeof(max) === 'number' && max > min)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        else
            return false;
    };

    Common.prototype.rndweightitem = function (probability) {
        if (typeof(probability) === 'object') {
            var all = 0;
            for (var key in probability)
                all += parseInt(probability[key]);
            var random = this.random(1, all);
            for (key in probability) {
                random -= probability[key];
                if (random <= 0)
                    return key;
            }
        }
    };

    Common.prototype.rndweightarray = function (itemarray, probability, unique) {
        if (this.count(itemarray) !== this.count(probability) || this.empty(itemarray) || !this.isarray(itemarray) || !this.isarray(probability))
            return false;
        else {
            var result = [];
            for (var i = 0; i < probability.length; i++)
                probability[i] = probability[i] < 0 ? 0 : probability[i];
            for (i = 0; i < itemarray.length; i++) {
                var key = this.rndweightitem(probability);
                result.push(itemarray[key]);
                delete probability[key];
                delete itemarray[key];
            }
            if (unique === true)
                result = this.unique(result);
            return result;
        }
    };

    Common.prototype.chr = function (code) {
        code = this.tonumber(code);
        if (code > 0xFFFF) {
            code -= 0x10000;
            return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
        }
        return String.fromCharCode(code);
    };

    Common.prototype.gencode = function (len) {
        len = this.tonumber(len);
        len = len <= 0 ? 8 : len;
        var result = '';
        for (var i = 0; i < len; i++) {
            switch (this.random(1, 3)) {
                case 1:
                    result += this.chr(this.random(48, 57));
                    break;

                case 2:
                    result += this.chr(this.random(65, 90));
                    break;

                case 3:
                    result += this.chr(this.random(97, 122));
                    break;
            }
        }
        return result;
    };

    Common.prototype.tostring = function (value) {
        var strvalue = '';
        switch (typeof(value)) {
            case 'object':
                if (value !== null)
                    strvalue = (value instanceof Object) ? value.message : value.toString();
                break;

            case 'undefined':
                break;

            default:
                strvalue = value.toString();
        }
        return strvalue;
    };

    Common.prototype.tonumber = function (value, convertInt) {
        var number = Number(value);
        return isNaN(number) ? 0 : (convertInt === true ? parseInt(number, 10) : number);
    };



    Common.prototype.ctype_upper = function (value) {
        value = this.tostring(value);
        var regex_upper = /^([A-Z]*)$/g;
        return regex_upper.test(value);
    };

    Common.prototype.ctype_lower = function (value) {
        value = this.tostring(value);
        var regex_lower = /^([a-z]*)$/g;
        return regex_lower.test(value);
    };

    Common.prototype.ctype_alpha = function (value) {
        value = this.tostring(value);
        var regex_alpha = /^([a-z]*)$/ig;
        return regex_alpha.test(value);
    };

    Common.prototype.ctype_alnum = function (value) {
        value = this.tostring(value);
        var regex_alpha = /^([a-z0-9]*)$/ig;
        return regex_alpha.test(value);
    };

    Common.prototype.filter_var = function (value, filter_type, filter_flag) {
        var pass = false;
        switch (filter_type) {
            case 'ip':
                switch (filter_flag) {
                    case 'ipv4':
                        var ipv4re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                        pass = ipv4re.test(value);
                        break;
                    case 'ipv6':
                        var ipv6re = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
                        pass = ipv6re.test(value);
                        break;
                    default :
                        pass = ipv4re.test(value) || ipv4re.test(value);
                }
                break;

            case 'email':
                var mailre = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                pass = mailre.test(value);
                break;
            default :
        }
        return pass;
    };

    Common.prototype.validate = function (params, object) {
        if (typeof (object) != 'object' || object === null)
            return false;
        for (var key in params) {
            if (!object.hasOwnProperty(key))
                return false;
            var value = object[key];
            if (!this.validate_value(value, params[key]))
                return false;
        }
        return true;
    };

    Common.prototype.validate_value = function (value, validates) {

        if (typeof (validates) == "object")
            return this.inarray(value, validates);
        else {
            var pass = true,
                validatearr = this.tostring(validates).split(',');
            for (var i = 0; i < validatearr.length; i++) {

                var validate = validatearr[i],
                    extend = '',
                    type = '';
                if (validate.indexOf(':') < 0)
                    type = validate;
                else {
                    type = validate.split(':', 1);
                    extend = validate.split(':')[1];
                }

                switch (type.toString()) {
                    case 'match' :
                        if (extend !== null)
                            pass = extend == value;
                        break;

                    case 'array' :
                        pass = (typeof (value) == 'object');
                        break;

                    case  'array+' :
                        pass = (typeof (value) == 'object') && !this.empty(value);
                        break;

                    case  'boolean':
                        pass = typeof (value) === 'boolean';
                        break;

                    case  'number':
                        pass = typeof (value) === 'number';
                        break;

                    case  'number+':
                        pass = (typeof (value) === 'number') && (!this.empty(value));
                        break;

                    case 'alphabet':
                        switch (extend) {
                            case 'upper':
                                pass = this.ctype_upper(value);
                                break;

                            case 'lower':
                                pass = this.ctype_lower(value);
                                break;

                            default :
                                pass = this.ctype_alpha(value);
                        }
                        break;

                    case 'alphanumber':
                        pass = this.ctype_alnum(value);
                        break;

                    case 'ip':
                        switch (extend) {
                            case 'v4':
                                pass = this.filter_var(value, 'ip', 'ipv4');
                                break;

                            case 'v6':
                                pass = this.filter_var(value, 'ip', 'ipv6');
                                break;

                            default :
                                pass = this.filter_var(value, 'ip');
                        }
                        break;

                    case 'email':
                        pass = this.filter_var(value, 'email');
                        break;

                    case 'must':
                        pass = (!(value === null || value === undefined));
                        break;

                    case 'min':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object')
                                pass = this.count(value) >= extend;
                            else
                                pass = this.tostring(value).length >= extend;
                        }
                        break;

                    case 'max':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object') {
                                pass = this.count(value) <= extend;
                            } else {
                                pass = this.tostring(value).length;
                            }
                        }
                        break;

                    case 'len':
                        extend = parseInt(extend, 10);
                        if (!this.empty(extend)) {
                            if (typeof (value) == 'object')
                                pass = this.count(value) === extend;
                            else
                                pass = this.tostring(value).length === extend;
                        }
                        break;

                    default :
                        if (typeof (validatearr) == 'object')
                            pass = this.in_array(value, validatearr);
                        else
                            pass = value.match(validate);
                }
                if (!pass)
                    return pass;
            }
            return true;
        }
    };

    Common.prototype.empty = function (mixed_var) {
        var key, i, len, emptyValues = [undefined, null, false, 0, '', '0'];
        for (i = 0, len = emptyValues.length; i < len; i++)
            if (mixed_var === emptyValues[i])
                return true;
        if (typeof mixed_var === 'object') {
            for (key in mixed_var)
                return false;
            return true;
        }
        return false;
    };

    Common.prototype.isint = function (mixed_var) {
        return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
    };

    Common.prototype.isnumeric = function (mixed_var) {
        var whitespace =
            " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
        return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
                1)) && mixed_var !== '' && !isNaN(mixed_var);
    };

    Common.prototype.isobj = function (mixed_var) {
        return mixed_var !== null && typeof mixed_var === 'object';
    };

    Common.prototype.isarray = function (mixed_var) {
        if (mixed_var !== null && typeof mixed_var !== 'object')
            return false;
        return Object.prototype.toString.call(mixed_var) === '[object Array]';
    };

    Common.prototype.unique = function (mixed_var) {
        if (typeof(mixed_var) === 'object') {
            if (mixed_var instanceof Array)
                return mixed_var.filter(function (elem, pos, arr) {
                    return arr.indexOf(elem) == pos;
                });
            else {
                var result = [];
                for (var key in mixed_var) {
                    if (result.indexOf(mixed_var[key]))
                        continue;
                    result.push(mixed_var[i]);
                }
                return result;
            }
        } else
            return mixed_var;
    };

    Common.prototype.range = function (start, end, step) {
        var range = [],
            typeofStart = typeof start,
            typeofEnd = typeof end;
        if (step <= 0)
            step = 1;
        if (typeofStart === "undefined" || typeofEnd === "undefined")
            return false;
        else if (typeofStart !== typeofEnd)
            return false;
        typeof step == "undefined" && (step = 1);
        if (end < start)
            step = -step;
        if (typeofStart == "number")
            while (step > 0 ? end >= start : end <= start) {
                range.push(start);
                start += step;
            }
        else if (typeofStart == "string") {
            if (start.length != 1 || end.length != 1)
                return false;
            start = start.charCodeAt(0);
            end = end.charCodeAt(0);
            while (step > 0 ? end >= start : end <= start) {
                range.push(String.fromCharCode(start));
                start += step;
            }
        } else
            return false;
        return range;
    };

    Common.prototype.first = function (obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            for (var key in obj) return {key: key, value: obj[key]};
        } else
            return false;
    };

    Common.prototype.last = function (obj, n) {
        return _.last(obj, n);
    };

    Common.prototype.min = function (obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            var list = [];
            for (var key in obj)
                list.push(this.tonumber(obj[key]));
            return Math.min.apply(Math, list);
        } else
            return false;
    };

    Common.prototype.max = function (obj) {
        if (typeof(obj) === 'object' && obj !== null) {
            var list = [];
            for (var key in obj)
                list.push(this.tonumber(obj[key]));
            return Math.max.apply(Math, list);
        } else
            return false;
    };

    Common.prototype.implode = function (glue, pieces) {
        var i = '',
            retVal = '',
            tGlue = '';
        if (arguments.length === 1) {
            pieces = glue;
            glue = '';
        }
        if (typeof pieces === 'object') {
            if (Object.prototype.toString.call(pieces) === '[object Array]')
                return pieces.join(glue);
            for (i in pieces) {
                retVal += tGlue + pieces[i];
                tGlue = glue;
            }
            return retVal;
        }
        return pieces;
    };

    Common.prototype.count = function (value) {
        var result = 0;
        for (var i in value)
            result++;
        return result;
    };

    Common.prototype.arraysum = function (value) {
        var result = 0;
        for (var i in value)
            result += value[i];
        return result;
    };

    Common.prototype.array_rand = function (input, num_req) {
        var indexes = [],
            ticks = num_req || 1,
            checkDuplicate = function (input, value) {
                var exist = false,
                    index = 0,
                    il = input.length;
                while (index < il) {
                    if (input[index] === value) {
                        exist = true;
                        break;
                    }
                    index++;
                }
                return exist;
            };

        if (Object.prototype.toString.call(input) === '[object Array]' && ticks <= input.length) {
            while (true) {
                var rand = Math.floor((Math.random() * input.length));
                if (indexes.length === ticks)
                    break;
                if (!checkDuplicate(indexes, rand))
                    indexes.push(rand);
            }
        } else
            indexes = null;
        return ((ticks == 1) ? indexes.join() : indexes);
    };

    Common.prototype.mergeobj = function (obja, objb) {
        var result = {};
        for (var att in obja)
            result[att] = obja[att];
        for (att in objb)
            result[att] = objb[att];
        return result;
    };

    Common.prototype.array_values = function (input) {
        var tmp_arr = [];
        if (input && typeof input === 'object' && input.change_key_case)
            return input.values();
        for (var key in input)
            tmp_arr[tmp_arr.length] = input[key];
        return tmp_arr;
    };

    Common.prototype.inarray = function (needle, haystack, argStrict) {
        var key = '',
            strict = !!argStrict;
        if (strict) {
            for (key in haystack)
                if (haystack[key] === needle)
                    return true;
        } else {
            for (key in haystack)
                if (haystack[key] == needle)
                    return true;
        }
        return false;
    };

    Common.prototype.in_array = Common.prototype.inarray;

    Common.prototype.shuffle = function (inputArr) {
        var valArr = [];

        for (var k in inputArr)
            if (inputArr.hasOwnProperty(k))
                valArr.push(inputArr[k]);
        valArr.sort(function () {
            return 0.5 - Math.random();
        });
        return valArr;
    };

    Common.prototype.sha1 = function (str) {
        var rotate_left = function (n, s) {
            return (n << s) | (n >>> (32 - s));
        }, cvt_hex = function (val) {
            var str = '',
                i, v;
            for (i = 7; i >= 0; i--) {
                v = (val >>> (i * 4)) & 0x0f;
                str += v.toString(16);
            }
            return str;
        };

        var blockstart, i, j, W = new Array(80),
            H0 = 0x67452301,
            H1 = 0xEFCDAB89,
            H2 = 0x98BADCFE,
            H3 = 0x10325476,
            H4 = 0xC3D2E1F0,
            A, B, C, D, E, temp;
        str = this.utf8_encode(str);
        var str_len = str.length,
            word_array = [];
        for (i = 0; i < str_len - 3; i += 4) {
            j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
            word_array.push(j);
        }

        switch (str_len % 4) {
            case 0:
                i = 0x080000000;
                break;
            case 1:
                i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
                break;
            case 2:
                i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
                break;
            case 3:
                i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                    8 | 0x80;
                break;
        }

        word_array.push(i);

        while ((word_array.length % 16) != 14)
            word_array.push(0);

        word_array.push(str_len >>> 29);
        word_array.push((str_len << 3) & 0x0ffffffff);

        for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
            for (i = 0; i < 16; i++)
                W[i] = word_array[blockstart + i];

            for (i = 16; i <= 79; i++)
                W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

            A = H0;
            B = H1;
            C = H2;
            D = H3;
            E = H4;

            for (i = 0; i <= 19; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 20; i <= 39; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 40; i <= 59; i++) {
                temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            for (i = 60; i <= 79; i++) {
                temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                E = D;
                D = C;
                C = rotate_left(B, 30);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0x0ffffffff;
            H1 = (H1 + B) & 0x0ffffffff;
            H2 = (H2 + C) & 0x0ffffffff;
            H3 = (H3 + D) & 0x0ffffffff;
            H4 = (H4 + E) & 0x0ffffffff;
        }

        temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
        return temp.toLowerCase();
    };

    Common.prototype.md5 = function (str) {
        var xl, rotateLeft = function (lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }, addUnsigned = function (lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4)
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            if (lX4 | lY4) {
                if (lResult & 0x40000000)
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                else
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            } else
                return (lResult ^ lX8 ^ lY8);
        }, _F = function (x, y, z) {
            return (x & y) | ((~x) & z);
        }, _G = function (x, y, z) {
            return (x & z) | (y & (~z));
        }, _H = function (x, y, z) {
            return (x ^ y ^ z);
        }, _I = function (x, y, z) {
            return (y ^ (x | (~z)));
        }, _FF = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _GG = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _HH = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, _II = function (a, b, c, d, x, s, ac) {
            a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
            return addUnsigned(rotateLeft(a, s), b);
        }, convertToWordArray = function (str) {
            var lWordCount, lMessageLength = str.length,
                lNumberOfWords_temp1 = lMessageLength + 8,
                lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64,
                lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16,
                lWordArray = new Array(lNumberOfWords - 1),
                lBytePosition = 0,
                lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        }, wordToHex = function (lValue) {
            var wordToHexValue = '',
                wordToHexValue_temp = '',
                lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                wordToHexValue_temp = '0' + lByte.toString(16);
                wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
            }
            return wordToHexValue;
        };

        var x = [],
            k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
            S12 = 12,
            S13 = 17,
            S14 = 22,
            S21 = 5,
            S22 = 9,
            S23 = 14,
            S24 = 20,
            S31 = 4,
            S32 = 11,
            S33 = 16,
            S34 = 23,
            S41 = 6,
            S42 = 10,
            S43 = 15,
            S44 = 21;

        str = this.utf8_encode(str);
        x = convertToWordArray(str);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;

        xl = x.length;
        for (k = 0; k < xl; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = _FF(a, b, c, d, x[k], S11, 0xD76AA478);
            d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = _GG(b, c, d, a, x[k], S24, 0xE9B6C7AA);
            a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = _HH(d, a, b, c, x[k], S32, 0xEAA127FA);
            c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = _II(a, b, c, d, x[k], S41, 0xF4292244);
            d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = addUnsigned(a, AA);
            b = addUnsigned(b, BB);
            c = addUnsigned(c, CC);
            d = addUnsigned(d, DD);
        }
        var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return temp.toLowerCase();
    };

    Common.prototype.utf8_encode = function (argString) {
        if (argString === null || typeof argString === 'undefined')
            return '';
        var string = (argString + ''),
            utftext = '',
            start, end, stringl = 0;
        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n),
                enc = null;
            if (c1 < 128)
                end++;
            else if (c1 > 127 && c1 < 2048)
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128);
            else if ((c1 & 0xF800) != 0xD800)
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            else {
                if ((c1 & 0xFC00) != 0xD800)
                    return false;
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00)
                    return false;
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start)
                    utftext += string.slice(start, end);
                utftext += enc;
                start = end = n + 1;
            }
        }
        if (end > start)
            utftext += string.slice(start, stringl);
        return utftext;
    };

    Common.prototype.random = function (min, max) {
        min = this.tonumber(min);
        max = this.tonumber(max);
        if (max === min)
            return max;
        else if (max > min)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        else if (max < min)
            return false;
    };

    Common.prototype.get_parameter = function (args, param) {
        var me = this;
        var result = {}, ended = false;
        if (!me.empty(args)) {
            for (var i in args) {
                if (typeof (args[i]) === 'function') {
                    result.callback = args[i];
                    ended = true;
                } else {
                    if (ended === false)
                        result[param[i]] = args[i];
                    else
                        result[param[i]] = undefined;
                }
            }
        } else {
            for (var i in param)
                result[param[i]] = undefined;
        }
        return result;
    };

    Common.prototype.clone = function (item) {
        if (!item) {
            return item;
        } // null, undefined values check
        var me = this;
        var types = [Number, String, Boolean];
        var result;
        types.forEach(function (type) {
            if (item instanceof type) {
                result = type(item);
            }
        });
        if (typeof result === "undefined") {
            if (Object.prototype.toString.call(item) === "[object Array]") {
                result = [];
                item.forEach(function (child, index) {
                    result[index] = me.clone(child);
                });
            } else if (typeof item == "object") {
                if (!item.prototype) {
                    result = {};
                    for (var i in item)
                        result[i] = me.clone(item[i]);
                } else if (false && item.constructor)
                    result = (false && item.constructor) ? new item.constructor() : item;
            } else
                result = item;
        }
        return result;
    };

    /**.
     * 从一个数组里取组合(比如求C32，则使用common.array_combination([1,2,3], 2)
     * @param array{array} 原始的数组
     * @param choose{int} 取多少个
     * @param filter{function} 过滤函数，如果有定义则返回组函数过滤后的组合,filter原型: function(arr){return true/false}
     * @returns {Array} 结果,比如[ [1,2],[1,3],[2,3]
     */
    Common.prototype.array_combination = function (array, choose, filter) {
        var composed = [];
        var combinated = [];
        if (typeof filter !== 'function')
            filter = false;

        function array_compose(start, choose) {

            if (choose === 0) {
                if (filter === false || filter(composed))
                    combinated.push(composed.concat());
            }
            else {
                for (var i = start; i <= array.length - choose; i++) {
                    composed.push(array[i]);
                    array_compose(i + 1, choose - 1);
                    composed.pop();
                }
            }
        }

        array_compose(0, choose);
        return combinated;
    };

    //实现php的ksort
    Common.prototype.ksort = function (parameter, iteratee) {
        var paramlist = [];
        for(var i in parameter){
            paramlist.push({name:i, value:parameter[i]});
        }
        paramlist = _.sortBy(paramlist, iteratee);

        var ret = {};
        for(var i in paramlist)
            ret[paramlist[i].name] = paramlist[i].value;
        return ret;
    };

    Common.prototype.toboolean = Common.prototype.empty;

    /***
     * 取得http请求参数
     * @param req
     * @returns {{}}
     */
    Common.prototype.objEmpty = function(req){
        var obj = {};
        for(var id  in req.body){
            obj[id] = req.body[id];
        }

        for(var id  in req.query){
            obj[id] = req.query[id];
        }

        for(var id  in req.params){
            obj[id] = req.params[id];
        }
        console.log("body params query:",obj);
        return obj;
    };

    /***
     * 获取用户权限参数
     * @param req
     * @param key
     * @returns {*}
     */
    Common.prototype.getReqKey = function(permissions,key,currmenu){
        try {
            console.log(permissions);

            permissions = JSON.parse(permissions);
            if (key === 'mode') {
                if (permissions.hasOwnProperty("mode")) {
                     return permissions.mode;
                }
            } else if (key === "menu") {
                if (permissions.hasOwnProperty("menu"))
                    return permissions.menu;
            } else if (key === "func") {
                if (permissions.hasOwnProperty("func"))
                    return permissions.func[currmenu];
            } else if(key === "all"){
                return permissions;
            }
        } catch (e) {
            console.log("解析用户权限数据模型失败！", e);
        }
        return "";
    };

    /***
     * 取得当月的最后一天
     * @param year
     * @param month
     * @returns {number}
     */
    Common.prototype.getLastDay = function(year,month){
        var new_year,new_month;
        if(!year)
            new_year = new Date().getFullYear();    //取当前的年份
        else
            new_year = year;

        if(!month)
            new_month = new Date().getMonth()+1;
        else
            new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）

        if(month>12){            //如果当前大于12月，则年份转到下一年
            new_month -=12;      //月份减
            new_year++;          //年份增
        }
        var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天
        var date_count =   (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月的天数
        var last_date =   new Date(new_date.getTime()-1000*60*60*24);//获得当月最后一天的日期
        return date_count;
    };

    Common.prototype.getDateList = function(){
        var retobj =[];
        for(var i =1 ;i<= this.getLastDay();i++){
            var datestr =  new Date().getFullYear() +"-"+ new Date().getMonth()+ "-" + i;
            var wekstr = '';
            switch(new Date(datestr).getDay()){
                case 0:
                    wekstr = "星期日";
                    break;
                case 1:
                    wekstr = "星期一";
                    break;
                case 2:
                    wekstr = "星期二";
                    break;
                case 3:
                    wekstr = "星期三";
                    break;
                case 4:
                    wekstr = "星期四";
                    break;
                case 5:
                    wekstr = "星期五";
                    break;
                case 6:
                    wekstr = "星期六";
                    break;
            }
            var ret = datestr + "  "+ wekstr;
            var obj ={
                id:i,
                text:ret
            };
            retobj.push(obj);
        }
        return  retobj;
    };
    /**
     * 取得指定范围内的随机数
     * @param min
     * @param max
     * @returns {number}
     */
    Common.prototype.random = function (min,max){
        return Math.floor(min+Math.random()*(max-min));
    }

    Common.prototype.currentDate =function(fmtStr){
        var year = new Date().getFullYear();
        var month = new Date().getMonth()+1;
        var day = new Date().getDate();
        var hour = new Date().getHours();
        var minut = new Date().getMinutes();
        var second= new Date().getSeconds();
        if(month<10){
            month = "0"+month;
        }
        if(day<10){
            day = "0"+day;
        }
        if(hour<10){
            hour ="0"+hour;
        }
        if(minut<10){
            minut ="0"+minut;
        }
        if(second<10){
            second ="0"+second;
        }

        switch(fmtStr.toLowerCase()){
            case "yyyymmddhhssmm":
                return  year+""+month+""+day+""+hour+""+minut+""+second;
            case "yyyy-mm-dd hh:mm:ss":
                return  year+"-"+month+"-"+day+" "+hour+":"+minut+":"+second;
            case "yyyy/mm/dd hh:mm:ss":
                return  year+"/"+month+"/"+day+" "+hour+":"+minut+":"+second;
            case "yyyymmdd":
                return  year+""+month+""+day;
            case "yyyy-mm-dd":
                return  year+"-"+month+"-"+day;
            case "yyyy/mm/dd":
                return  year+"/"+month+"/"+day;
            case "hh:mm:ss":
                return  hour+":"+minut+":"+second;
            case "hhmmss":
                return  hour+""+minut+""+second;
            case "mmddhhmmss":
                return  month+""+day+""+hour+""+minut+""+second;
            default:
                return new Date().getTime();
        }
    };
    Common.prototype.arrUsername2NameDict = function(arr){
        if(this.isarray(arr)){
            var dict = {};
            for(var idx in arr){
                if(arr[idx].hasOwnProperty("username") && !this.empty(arr[idx]["username"]) &&
                    arr[idx].hasOwnProperty("name") && !this.empty(arr[idx]["name"])){
                    dict[arr[idx]["username"]] = arr[idx]["name"];
                }
            }
            return dict;
        }
    };
    Common.prototype.arrUsername2UserInfo = function(arr){
        if(this.isarray(arr)) {
            var dict = {};
            for(var idx in arr){
                if(arr[idx].hasOwnProperty("username") && !this.empty(arr[idx]["username"])){
                    dict[arr[idx]["username"]] = arr[idx];
                }
            }
            return dict;
        }
    };
    Common.prototype.addDays = function(date, days){
        var d=new Date(date);
        d.setDate(d.getDate()+days);
        return d;
    };
    
    module.exports = new Common();
})();