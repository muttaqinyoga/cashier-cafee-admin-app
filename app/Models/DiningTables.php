<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiningTables extends Model
{
    protected $table = "dining_tables";
    public $incrementing = false;
    public $keyType = 'string';

    public function order()
    {
        return $this->hasMany("App\Models\Order", "id");
    }
}
