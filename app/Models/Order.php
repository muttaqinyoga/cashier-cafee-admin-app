<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $incrementing = false;
    public $keyType = 'string';

    public function foods()
    {
        return $this->belongsToMany(Food::class, "order_details")->withPivot('quantity_ordered');
    }

    public function getTotalQuantity()
    {
        $total = 0;
        foreach ($this->foods as $f) {
            $total += $f->pivot->quantity_ordered;
        }

        return $total;
    }

    public function table()
    {
        return $this->belongsTo("App\Models\DiningTables", "table_id");
    }
}
