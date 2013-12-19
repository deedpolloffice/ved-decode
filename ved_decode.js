/**
  This file is part of VED DECODE

  Copyright © 2013 Deed Poll Office Ltd, UK

  VED DECODE is free software: you can redistribute it and/or modify
  it under the terms of the Apache License, Version 2.0 (the "License").
  You may not use this work except in compliance with the License.

  You should have received a copy of the License in the LICENSE file,
  along with this program.  If not, you can get a copy of the license at:
  <http://www.apache.org/licenses/LICENSE-2.0>.

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */

// For Internet Explorer 9 and below, you’ll need to include the base64 library
// <http://code.google.com/p/stringencoders/source/browse/trunk/javascript/base64.js>
if (!window.atob) window.atob = base64.decode;

function ved_decode(ved) {
    // Copyright 2013 Deed Poll Office Ltd, UK <http://deed-poll-office.org.uk>
    // Licensed under Apache Licence v2.0 <http://apache.org/licenses/LICENSE-2.0>
    var keys = { t: 2, r: 6, s: 7, i: 1 }, ret = {}, re, match;
    if (ved.match(/^1/)) {
        re = /([a-z]+):([0-9]+)/ig;
        while ((match = re.exec(ved)) !== null)
            ret[keys[match[1]] || match[1]] = parseInt(match[2], 10);
        return ret;
    }
    var vedBinary = atob(ved.replace(/_/, '+').replace('-', '/').substr(1));
    re = /([\x80-\xff]*[\x00-\x7f])([\x80-\xff]*[\x00-\x7f])/g;
    while ((match = re.exec(vedBinary)) !== null)
        ret[varint_decode(match[1]) >> 3] = varint_decode(match[2]);
    return ret;
    function varint_decode(vint) {
        var ret = 0, i = 0;
        for (; i < vint.length; ++i) ret += (vint.charCodeAt(i) & 0x7f) << (i * 7);
        return ret;
    }
}

