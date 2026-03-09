function toRecord(value) {
    return value && typeof value === 'object' && !Array.isArray(value)
        ? value
        : null;
}
function toStringValue(value) {
    return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}
function toNumberValue(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}
function toBooleanValue(value) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'number') {
        if (value === 1)
            return true;
        if (value === 0)
            return false;
    }
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true' || normalized === '1')
            return true;
        if (normalized === 'false' || normalized === '0')
            return false;
    }
    return undefined;
}
export function normalizeTableColumns(columns) {
    const normalizedColumns = {};
    if (Array.isArray(columns)) {
        for (const rawColumn of columns) {
            const column = normalizeTableColumn(rawColumn);
            if (!column)
                continue;
            normalizedColumns[column.name] = column;
        }
        return normalizedColumns;
    }
    const rawColumns = toRecord(columns);
    if (!rawColumns) {
        return normalizedColumns;
    }
    for (const rawColumn of Object.values(rawColumns)) {
        const column = normalizeTableColumn(rawColumn);
        if (!column)
            continue;
        normalizedColumns[column.name] = column;
    }
    return normalizedColumns;
}
function normalizeTableColumn(rawColumn) {
    const column = toRecord(rawColumn);
    if (!column) {
        return null;
    }
    const name = toStringValue(column.name);
    if (!name) {
        return null;
    }
    const type = (toStringValue(column.type) ?? 'string');
    const normalized = {
        ...column,
        name,
        type,
    };
    const title = toStringValue(column.title);
    if (title !== undefined)
        normalized.title = title;
    const required = toBooleanValue(column.required);
    if (required !== undefined)
        normalized.required = required;
    const editable = toBooleanValue(column.editable);
    if (editable !== undefined)
        normalized.editable = editable;
    const searchable = toBooleanValue(column.searchable);
    if (searchable !== undefined)
        normalized.searchable = searchable;
    const crs = toStringValue(column.crs);
    if (crs !== undefined)
        normalized.crs = crs;
    if ('default_value' in column && !('defaultValue' in normalized)) {
        normalized.defaultValue = column.default_value;
    }
    return normalized;
}
export function normalizeTable(rawTable) {
    const raw = toRecord(rawTable) ?? {};
    const databaseId = toNumberValue(raw.databaseId ?? raw.database_id ?? raw.database) ?? 0;
    const database = toStringValue(raw.database_name ?? raw.database ?? raw.dbname) ??
        (databaseId > 0 ? String(databaseId) : '');
    const normalized = {
        ...raw,
        id: toNumberValue(raw.id) ?? 0,
        database,
        databaseId,
        name: toStringValue(raw.name ?? raw.table_name) ?? '',
        title: toStringValue(raw.title ?? raw.name ?? raw.table_name) ?? '',
        wfs: toStringValue(raw.wfs ?? raw.wfs_url) ?? '',
        geometryName: toStringValue(raw.geometryName ?? raw.geometry_name) ?? 'geometry',
        columns: normalizeTableColumns(raw.columns),
    };
    const idName = toStringValue(raw.idName ?? raw.id_name);
    if (idName !== undefined)
        normalized.idName = idName;
    const description = toStringValue(raw.description);
    if (description !== undefined)
        normalized.description = description;
    const projection = toStringValue(raw.projection);
    if (projection !== undefined)
        normalized.projection = projection;
    const minZoomLevel = toNumberValue(raw.minZoomLevel ?? raw.min_zoom_level);
    if (minZoomLevel !== undefined)
        normalized.minZoomLevel = minZoomLevel;
    const maxZoomLevel = toNumberValue(raw.maxZoomLevel ?? raw.max_zoom_level);
    if (maxZoomLevel !== undefined)
        normalized.maxZoomLevel = maxZoomLevel;
    const searchable = toBooleanValue(raw.searchable);
    if (searchable !== undefined)
        normalized.searchable = searchable;
    const editable = toBooleanValue(raw.editable);
    if (editable !== undefined)
        normalized.editable = editable;
    const readOnly = toBooleanValue(raw.readOnly ?? raw.read_only);
    if (readOnly !== undefined)
        normalized.readOnly = readOnly;
    const tileZoomLevel = toNumberValue(raw.tileZoomLevel ?? raw.tile_zoom_level);
    if (tileZoomLevel !== undefined)
        normalized.tileZoomLevel = tileZoomLevel;
    const docURI = toStringValue(raw.docURI ?? raw.doc_uri);
    if (docURI !== undefined)
        normalized.docURI = docURI;
    return normalized;
}
//# sourceMappingURL=normalize.js.map