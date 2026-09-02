package com.meridian.capstone.util;

import com.meridian.capstone.domain.WorkOrderStatus;
import com.meridian.capstone.exception.IllegalTransitionException;
import java.util.*;

public class StateTransitionValidator {

    // Define valid transitions
    private static final Map<WorkOrderStatus, Set<WorkOrderStatus>> VALID_TRANSITIONS = new HashMap<>();

    static {
        // NEW can go to ASSIGNED or CANCELLED
        VALID_TRANSITIONS.put(WorkOrderStatus.NEW, Set.of(
                WorkOrderStatus.ASSIGNED,
                WorkOrderStatus.CANCELLED
        ));

        // ASSIGNED can go to IN_PROGRESS, ON_HOLD, or CANCELLED
        VALID_TRANSITIONS.put(WorkOrderStatus.ASSIGNED, Set.of(
                WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.ON_HOLD,
                WorkOrderStatus.CANCELLED
        ));

        // IN_PROGRESS can go to ON_HOLD, COMPLETED, or CANCELLED
        VALID_TRANSITIONS.put(WorkOrderStatus.IN_PROGRESS, Set.of(
                WorkOrderStatus.ON_HOLD,
                WorkOrderStatus.COMPLETED,
                WorkOrderStatus.CANCELLED
        ));

        // ON_HOLD can go to IN_PROGRESS, ASSIGNED, or CANCELLED
        VALID_TRANSITIONS.put(WorkOrderStatus.ON_HOLD, Set.of(
                WorkOrderStatus.IN_PROGRESS,
                WorkOrderStatus.ASSIGNED,
                WorkOrderStatus.CANCELLED
        ));

        // COMPLETED can go to CLOSED
        VALID_TRANSITIONS.put(WorkOrderStatus.COMPLETED, Set.of(
                WorkOrderStatus.CLOSED
        ));

        // CLOSED is final - no transitions
        VALID_TRANSITIONS.put(WorkOrderStatus.CLOSED, Set.of());

        // CANCELLED is final - no transitions
        VALID_TRANSITIONS.put(WorkOrderStatus.CANCELLED, Set.of());
    }

    public static boolean isValidTransition(WorkOrderStatus fromStatus, WorkOrderStatus toStatus) {
        if (fromStatus == null || toStatus == null) {
            return false;
        }
        
        Set<WorkOrderStatus> allowedTransitions = VALID_TRANSITIONS.get(fromStatus);
        return allowedTransitions != null && allowedTransitions.contains(toStatus);
    }

    public static void validateTransition(WorkOrderStatus fromStatus, WorkOrderStatus toStatus) {
        if (!isValidTransition(fromStatus, toStatus)) {
            throw new IllegalTransitionException(
                    "Cannot transition from " + fromStatus + " to " + toStatus
            );
        }
    }
}
