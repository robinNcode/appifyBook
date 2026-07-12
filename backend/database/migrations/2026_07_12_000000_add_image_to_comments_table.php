<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('content');
            // A comment may now be image-only, so content is no longer required.
            $table->text('content')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('image_path');
            $table->text('content')->nullable(false)->change();
        });
    }
};
