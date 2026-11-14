# Firestore Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Identity Integrity (`WorldPlayer`)**: A document at `/world_players/{playerId}` must have `playerId == request.auth.uid` and `incoming().uid == request.auth.uid`, with `request.auth.token.email_verified == true`.
2. **Schema & Volumetric Bounds (`WorldPlayer`)**: Must contain only `['uid', 'name', 'color', 'x', 'y', 'z', 'yaw', 'zone', 'isMoving', 'isPublic', 'updatedAt']`, `name` size `1..32`, `color` size `4..16`, `zone` size `1..24`, `isPublic == true`, and `updatedAt == request.time`.
3. **Identity Integrity (`WorldBlock`)**: A document at `/world_blocks/{blockId}` must have `incoming().ownerId == request.auth.uid` on creation and can only be deleted by `resource.data.ownerId == request.auth.uid`.
4. **Query Enforcer (`list`)**: All `list` queries on `/world_players` and `/world_blocks` must filter by `resource.data.isPublic == true`.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Write**: `auth = null` writing to `/world_players/user_1` -> `PERMISSION_DENIED`.
2. **Unverified Email Spoof**: `auth = { uid: 'user_1', token: { email_verified: false } }` writing to `/world_players/user_1` -> `PERMISSION_DENIED`.
3. **UID Path Mismatch**: `auth.uid = 'user_1'` writing to `/world_players/user_2` -> `PERMISSION_DENIED`.
4. **Payload UID Spoof**: `auth.uid = 'user_1'` writing `{ uid: 'user_2', ... }` to `/world_players/user_1` -> `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: Including `{ ..., isAdmin: true }` on `/world_players/user_1` -> `PERMISSION_DENIED`.
6. **Oversized Name DoW**: `name` of 5000 chars on `/world_players/user_1` -> `PERMISSION_DENIED`.
7. **Forged Client Timestamp**: `updatedAt` not equal to `request.time` -> `PERMISSION_DENIED`.
8. **Invalid Document ID Poisoning**: `/world_blocks/invalid$id!@#` -> `PERMISSION_DENIED`.
9. **Orphan Block Owner Spoof**: `auth.uid = 'user_1'` creating `/world_blocks/b_1` with `ownerId: 'user_2'` -> `PERMISSION_DENIED`.
10. **Unauthorized Block Deletion**: `auth.uid = 'user_2'` deleting `/world_blocks/b_1` owned by `'user_1'` -> `PERMISSION_DENIED`.
11. **Block Coordinate Out-of-Bounds**: `y: 999` on `/world_blocks/b_1` -> `PERMISSION_DENIED`.
12. **Unconstrained List Scraping**: `list` query without `where('isPublic', '==', true)` -> `PERMISSION_DENIED`.
