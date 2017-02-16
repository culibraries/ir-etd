<?php

class xmlModel {

	protected $file, $xml;

	public function __construct($file) {
		$this->file = $file;
	}

	public function xml2js($xmlnode) {
	    $root = (func_num_args() > 1 ? false : true);
	    $jsnode = array();

	    if (!$root) {
	        if (count($xmlnode->attributes()) > 0){
	            $jsnode["$"] = array();
	            foreach($xmlnode->attributes() as $key => $value)
	                $jsnode["$"][$key] = (string)$value;
	        }

	        $textcontent = trim((string)$xmlnode);
	        if (count($textcontent) > 0)
	            $jsnode["_"] = $textcontent;

	        foreach ($xmlnode->children() as $childxmlnode) {
	            $childname = $childxmlnode->getName();
	            if (!array_key_exists($childname, $jsnode))
	                $jsnode[$childname] = array();
	            array_push($jsnode[$childname], xml2js($childxmlnode, true));
	        }
	        return $jsnode;
	    } else {
	        $nodename = $xmlnode->getName();
	        $jsnode[$nodename] = array();
	        array_push($jsnode[$nodename], xml2js($xmlnode, true));
	        return json_encode($jsnode);
	    }
	}  


	// public function parseXml() {
	// 	echo test();
	// }
	

}

?>