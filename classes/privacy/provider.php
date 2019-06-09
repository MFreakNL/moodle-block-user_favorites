<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Privacy Subsystem implementation for block_user_favorites.
 *
 * @package    block_user_favorites
 * @copyright  26-10-2018 MFreak.nl
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace block_user_favorites\privacy;

use core_privacy\local\metadata\collection;
use core_privacy\local\request\user_preference_provider;

defined('MOODLE_INTERNAL') || die;

/**
 * Privacy Subsystem for block_user_favorites.
 *
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  26-10-2018 MFreak.nl
 */
class provider implements \core_privacy\local\metadata\provider, user_preference_provider {

    /**
     * Returns meta-data information about the block_user_favorites.
     *
     * @param collection $collection A collection of meta-data.
     *
     * @return collection Return the collection of meta-data.
     */
    public static function get_metadata(collection $collection) : collection {
        $collection->add_user_preference('user_favorites', 'privacy:metadata:links');

        return $collection;
    }

    /**
     * Export all user preferences for the user_favorites block
     *
     * @param int $userid The userid of the user whose data is to be exported.
     *
     * @throws \coding_exception
     */
    public static function export_user_preferences(int $userid) {
        $preference = get_user_preferences('user_favorites', null, $userid);
        if (isset($preference)) {
            \core_privacy\local\request\writer::export_user_preference('user_favorites', '',
                $preference, get_string('privacy:metadata:links', 'block_user_favorites'));
        }
    }
}
