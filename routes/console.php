<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('medsearch:about', function (): void {
    $this->info('MedSearch Africa backend foundation');
})->purpose('Display the MedSearch backend identifier');
