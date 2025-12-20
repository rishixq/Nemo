# --------------------------------------------------
# ROLE DEFINITIONS
# --------------------------------------------------

ALLOWED_ROLES = {
    "admin",
    "doctor",
    "student",
    "user",
}


def is_valid_role(role: str) -> bool:
    """
    Check whether the provided role is supported.
    """
    if not role:
        return False
    return role.lower() in ALLOWED_ROLES


def normalize_role(role: str) -> str:
    """
    Normalize role input to a safe default.
    """
    if role and role.lower() in ALLOWED_ROLES:
        return role.lower()
    return "user"
