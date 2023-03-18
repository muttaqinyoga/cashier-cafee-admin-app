<?php

namespace App\Models;


class Response
{

    private $message;
    private $status;
    private $data;
    private $httpCode;

    public function getMessage()
    {
        return $this->message;
    }
    public function getStatus()
    {
        return $this->status;
    }
    public function getData()
    {
        return $this->data;
    }
    public function getHttpCode()
    {
        return $this->httpCode;
    }

    public function setMessage($msg)
    {
        $this->message = $msg;
    }

    public function setStatus($sts)
    {
        $this->status = $sts;
    }
    public function setData($data)
    {
        $this->data = $data;
    }

    public function setHttpCode($code)
    {
        $this->httpCode = $code;
    }

    public function build()
    {
        return response()->json([
            "status" => $this->getStatus(),
            "message" => $this->getMessage(),
            "data" => $this->getData()
        ], $this->getHttpCode());
    }
}
