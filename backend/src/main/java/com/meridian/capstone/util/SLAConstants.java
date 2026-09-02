package com.meridian.capstone.util;

import com.meridian.capstone.domain.Priority;
import java.util.HashMap;
import java.util.Map;

public class SLAConstants {

    // SLA hours based on priority
    private static final Map<Priority, Integer> SLA_HOURS = new HashMap<>();

    static {
        SLA_HOURS.put(Priority.HIGH, 4);      // 4 hours for HIGH priority
        SLA_HOURS.put(Priority.MEDIUM, 24);   // 24 hours for MEDIUM priority
        SLA_HOURS.put(Priority.LOW, 72);      // 72 hours for LOW priority
    }

    public static int getSLAHours(Priority priority) {
        return SLA_HOURS.getOrDefault(priority, 72);
    }

    public static int getSLAMinutes(Priority priority) {
        return getSLAHours(priority) * 60;
    }
}
