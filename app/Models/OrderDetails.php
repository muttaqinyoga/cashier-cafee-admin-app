<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetails extends Model
{
    protected $table = "order_details";
    public $incrementing = false;
    public $keyType = 'string';

    // public function order()
    // {
    //     return $this->belongsToMany(Order::class);
    // }

    // public function foods()
    // {
    //     return $this->belongsToMany(Food::class);
    // }
}
