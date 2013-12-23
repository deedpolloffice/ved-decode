<?php

function ved_decode($ved)
{
    // Copyright 2013 Deed Poll Office Ltd, UK <http://deed-poll-office.org.uk>
    // Licensed under Apache Licence v2.0 <http://apache.org/licenses/LICENSE-2.0>
    $keys = array('t' => 2, 'r' => 6, 's' => 7, 'i' => 1);
    $ret  = array();
    if (substr($ved, 0, 1) == '1') {
        preg_match_all('/([a-z]+):([0-9]+)/i', $ved, $matches, PREG_SET_ORDER);
        foreach ($matches as $m)
            $ret[isset($keys[$m[1]]) ? $keys[$m[1]] : $m[1]] = (int) $m[2];
        return $ret;
    }
    preg_match_all('/([\x80-\xff]*[\0-\x7f])([\x80-\xff]*[\0-\x7f])/',
        base64_decode(str_replace(array('_','-'), array('+','/'), substr($ved, 1))),
        $matches, PREG_SET_ORDER);
    foreach ($matches as $m) {
        $key = $val = 0;
        foreach (str_split($m[1]) as $i => $c) $key += (ord($c) & 0x7f) << $i * 7;
        foreach (str_split($m[2]) as $i => $c) $val += (ord($c) & 0x7f) << $i * 7;
        $ret[$key >> 3] = $val;
    }
    return $ret;
}

