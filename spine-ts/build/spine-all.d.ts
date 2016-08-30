declare module spine {
    class AssetManager implements Disposable {
        private pathPrefix;
        private textureLoader;
        private assets;
        private errors;
        private toLoad;
        private loaded;
        constructor(textureLoader: (image: HTMLImageElement) => any, pathPrefix?: string);
        loadText(path: string, success?: (path: string, text: string) => void, error?: (path: string, error: string) => void): void;
        loadTexture(path: string, success?: (path: string, image: HTMLImageElement) => void, error?: (path: string, error: string) => void): void;
        get(path: string): any;
        remove(path: string): void;
        removeAll(): void;
        isLoadingComplete(): boolean;
        getToLoad(): number;
        getLoaded(): number;
        dispose(): void;
        hasErrors(): boolean;
        getErrors(): Map<string>;
    }
}
declare module spine.canvas {
    class AssetManager extends spine.AssetManager {
        constructor(pathPrefix?: string);
    }
}
declare module spine {
    abstract class Texture {
        protected _image: HTMLImageElement;
        constructor(image: HTMLImageElement);
        getImage(): HTMLImageElement;
        abstract setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        abstract setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        abstract dispose(): void;
        static filterFromString(text: string): TextureFilter;
        static wrapFromString(text: string): TextureWrap;
    }
    enum TextureFilter {
        Nearest = 9728,
        Linear = 9729,
        MipMap = 9987,
        MipMapNearestNearest = 9984,
        MipMapLinearNearest = 9985,
        MipMapNearestLinear = 9986,
        MipMapLinearLinear = 9987,
    }
    enum TextureWrap {
        MirroredRepeat = 33648,
        ClampToEdge = 33071,
        Repeat = 10497,
    }
    class TextureRegion {
        renderObject: any;
        u: number;
        v: number;
        u2: number;
        v2: number;
        width: number;
        height: number;
        rotate: boolean;
        offsetX: number;
        offsetY: number;
        originalWidth: number;
        originalHeight: number;
    }
}
declare module spine.canvas {
    class CanvasTexture extends Texture {
        constructor(image: HTMLImageElement);
        setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        dispose(): void;
    }
}
declare module spine.canvas {
    class SkeletonRenderer {
        static QUAD_TRIANGLES: number[];
        private ctx;
        triangleRendering: boolean;
        debugRendering: boolean;
        constructor(context: CanvasRenderingContext2D);
        draw(skeleton: Skeleton): void;
        private drawImages(skeleton);
        private drawTriangles(skeleton);
        private drawTriangle(img, x0, y0, u0, v0, x1, y1, u1, v1, x2, y2, u2, v2);
    }
}
declare module spine {
    class Animation {
        name: string;
        timelines: Array<Timeline>;
        duration: number;
        constructor(name: string, timelines: Array<Timeline>, duration: number);
        apply(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event>): void;
        mix(skeleton: Skeleton, lastTime: number, time: number, loop: boolean, events: Array<Event>, alpha: number): void;
        static binarySearch(values: ArrayLike<number>, target: number, step?: number): number;
        static linearSearch(values: ArrayLike<number>, target: number, step: number): number;
    }
    interface Timeline {
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    abstract class CurveTimeline implements Timeline {
        static LINEAR: number;
        static STEPPED: number;
        static BEZIER: number;
        static BEZIER_SIZE: number;
        private curves;
        constructor(frameCount: number);
        getFrameCount(): number;
        setLinear(frameIndex: number): void;
        setStepped(frameIndex: number): void;
        getCurveType(frameIndex: number): number;
        setCurve(frameIndex: number, cx1: number, cy1: number, cx2: number, cy2: number): void;
        getCurvePercent(frameIndex: number, percent: number): number;
        abstract apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class RotateTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATION: number;
        static ROTATION: number;
        boneIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, degrees: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class TranslateTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_X: number;
        static PREV_Y: number;
        static X: number;
        static Y: number;
        boneIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, x: number, y: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class ScaleTimeline extends TranslateTimeline {
        constructor(frameCount: number);
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class ShearTimeline extends TranslateTimeline {
        constructor(frameCount: number);
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class ColorTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_R: number;
        static PREV_G: number;
        static PREV_B: number;
        static PREV_A: number;
        static R: number;
        static G: number;
        static B: number;
        static A: number;
        slotIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, r: number, g: number, b: number, a: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class AttachmentTimeline implements Timeline {
        slotIndex: number;
        frames: ArrayLike<number>;
        attachmentNames: Array<string>;
        constructor(frameCount: number);
        getFrameCount(): number;
        setFrame(frameIndex: number, time: number, attachmentName: string): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, events: Array<Event>, alpha: number): void;
    }
    class EventTimeline implements Timeline {
        frames: ArrayLike<number>;
        events: Array<Event>;
        constructor(frameCount: number);
        getFrameCount(): number;
        setFrame(frameIndex: number, event: Event): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class DrawOrderTimeline implements Timeline {
        frames: ArrayLike<number>;
        drawOrders: Array<Array<number>>;
        constructor(frameCount: number);
        getFrameCount(): number;
        setFrame(frameIndex: number, time: number, drawOrder: Array<number>): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class DeformTimeline extends CurveTimeline {
        frames: ArrayLike<number>;
        frameVertices: Array<ArrayLike<number>>;
        slotIndex: number;
        attachment: VertexAttachment;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, vertices: ArrayLike<number>): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class IkConstraintTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_MIX: number;
        static PREV_BEND_DIRECTION: number;
        static MIX: number;
        static BEND_DIRECTION: number;
        ikConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, mix: number, bendDirection: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class TransformConstraintTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATE: number;
        static PREV_TRANSLATE: number;
        static PREV_SCALE: number;
        static PREV_SHEAR: number;
        static ROTATE: number;
        static TRANSLATE: number;
        static SCALE: number;
        static SHEAR: number;
        transformConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number, scaleMix: number, shearMix: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class PathConstraintPositionTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_VALUE: number;
        static VALUE: number;
        pathConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, value: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class PathConstraintSpacingTimeline extends PathConstraintPositionTimeline {
        constructor(frameCount: number);
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
    class PathConstraintMixTimeline extends CurveTimeline {
        static ENTRIES: number;
        static PREV_TIME: number;
        static PREV_ROTATE: number;
        static PREV_TRANSLATE: number;
        static ROTATE: number;
        static TRANSLATE: number;
        pathConstraintIndex: number;
        frames: ArrayLike<number>;
        constructor(frameCount: number);
        setFrame(frameIndex: number, time: number, rotateMix: number, translateMix: number): void;
        apply(skeleton: Skeleton, lastTime: number, time: number, firedEvents: Array<Event>, alpha: number): void;
    }
}
declare module spine {
    class AnimationState {
        data: AnimationStateData;
        tracks: TrackEntry[];
        events: Event[];
        listeners: AnimationStateListener[];
        timeScale: number;
        constructor(data?: AnimationStateData);
        update(delta: number): void;
        apply(skeleton: Skeleton): void;
        clearTracks(): void;
        clearTrack(trackIndex: number): void;
        freeAll(entry: TrackEntry): void;
        expandToIndex(index: number): TrackEntry;
        setCurrent(index: number, entry: TrackEntry): void;
        setAnimation(trackIndex: number, animationName: string, loop: boolean): TrackEntry;
        setAnimationWith(trackIndex: number, animation: Animation, loop: boolean): TrackEntry;
        addAnimation(trackIndex: number, animationName: string, loop: boolean, delay: number): TrackEntry;
        addAnimationWith(trackIndex: number, animation: Animation, loop: boolean, delay: number): TrackEntry;
        getCurrent(trackIndex: number): TrackEntry;
        addListener(listener: AnimationStateListener): void;
        removeListener(listener: AnimationStateListener): void;
        clearListeners(): void;
    }
    class TrackEntry {
        next: TrackEntry;
        previous: TrackEntry;
        animation: Animation;
        loop: boolean;
        delay: number;
        time: number;
        lastTime: number;
        endTime: number;
        timeScale: number;
        mixTime: number;
        mixDuration: number;
        listener: AnimationStateListener;
        mix: number;
        reset(): void;
        isComplete(): boolean;
    }
    abstract class AnimationStateAdapter implements AnimationStateListener {
        event(trackIndex: number, event: Event): void;
        complete(trackIndex: number, loopCount: number): void;
        start(trackIndex: number): void;
        end(trackIndex: number): void;
    }
    interface AnimationStateListener {
        event(trackIndex: number, event: Event): void;
        complete(trackIndex: number, loopCount: number): void;
        start(trackIndex: number): void;
        end(trackIndex: number): void;
    }
}
declare module spine {
    class AnimationStateData {
        skeletonData: SkeletonData;
        animationToMixTime: Map<number>;
        defaultMix: number;
        constructor(skeletonData: SkeletonData);
        setMix(fromName: string, toName: string, duration: number): void;
        setMixWith(from: Animation, to: Animation, duration: number): void;
        getMix(from: Animation, to: Animation): number;
    }
}
declare module spine {
    enum BlendMode {
        Normal = 0,
        Additive = 1,
        Multiply = 2,
        Screen = 3,
    }
}
declare module spine {
    class Bone implements Updatable {
        data: BoneData;
        skeleton: Skeleton;
        parent: Bone;
        children: Bone[];
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        appliedRotation: number;
        a: number;
        b: number;
        worldX: number;
        c: number;
        d: number;
        worldY: number;
        worldSignX: number;
        worldSignY: number;
        sorted: boolean;
        constructor(data: BoneData, skeleton: Skeleton, parent: Bone);
        update(): void;
        updateWorldTransform(): void;
        updateWorldTransformWith(x: number, y: number, rotation: number, scaleX: number, scaleY: number, shearX: number, shearY: number): void;
        setToSetupPose(): void;
        getWorldRotationX(): number;
        getWorldRotationY(): number;
        getWorldScaleX(): number;
        getWorldScaleY(): number;
        worldToLocalRotationX(): number;
        worldToLocalRotationY(): number;
        rotateWorld(degrees: number): void;
        updateLocalTransform(): void;
        worldToLocal(world: Vector2): Vector2;
        localToWorld(local: Vector2): Vector2;
    }
}
declare module spine {
    class BoneData {
        index: number;
        name: string;
        parent: BoneData;
        length: number;
        x: number;
        y: number;
        rotation: number;
        scaleX: number;
        scaleY: number;
        shearX: number;
        shearY: number;
        inheritRotation: boolean;
        inheritScale: boolean;
        constructor(index: number, name: string, parent: BoneData);
    }
}
declare module spine {
    class Event {
        data: EventData;
        intValue: number;
        floatValue: number;
        stringValue: string;
        time: number;
        constructor(time: number, data: EventData);
    }
}
declare module spine {
    class EventData {
        name: string;
        intValue: number;
        floatValue: number;
        stringValue: string;
        constructor(name: string);
    }
}
declare module spine {
    class IkConstraint implements Updatable {
        data: IkConstraintData;
        bones: Array<Bone>;
        target: Bone;
        mix: number;
        bendDirection: number;
        level: number;
        constructor(data: IkConstraintData, skeleton: Skeleton);
        apply(): void;
        update(): void;
        apply1(bone: Bone, targetX: number, targetY: number, alpha: number): void;
        apply2(parent: Bone, child: Bone, targetX: number, targetY: number, bendDir: number, alpha: number): void;
    }
}
declare module spine {
    class IkConstraintData {
        name: string;
        bones: BoneData[];
        target: BoneData;
        bendDirection: number;
        mix: number;
        constructor(name: string);
    }
}
declare module spine {
    class PathConstraint implements Updatable {
        static NONE: number;
        static BEFORE: number;
        static AFTER: number;
        data: PathConstraintData;
        bones: Array<Bone>;
        target: Slot;
        position: number;
        spacing: number;
        rotateMix: number;
        translateMix: number;
        spaces: number[];
        positions: number[];
        world: number[];
        curves: number[];
        lengths: number[];
        segments: number[];
        constructor(data: PathConstraintData, skeleton: Skeleton);
        apply(): void;
        update(): void;
        computeWorldPositions(path: PathAttachment, spacesCount: number, tangents: boolean, percentPosition: boolean, percentSpacing: boolean): number[];
        addBeforePosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
        addAfterPosition(p: number, temp: Array<number>, i: number, out: Array<number>, o: number): void;
        addCurvePosition(p: number, x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, out: Array<number>, o: number, tangents: boolean): void;
    }
}
declare module spine {
    class PathConstraintData {
        name: string;
        bones: BoneData[];
        target: SlotData;
        positionMode: PositionMode;
        spacingMode: SpacingMode;
        rotateMode: RotateMode;
        offsetRotation: number;
        position: number;
        spacing: number;
        rotateMix: number;
        translateMix: number;
        constructor(name: string);
    }
    enum PositionMode {
        Fixed = 0,
        Percent = 1,
    }
    enum SpacingMode {
        Length = 0,
        Fixed = 1,
        Percent = 2,
    }
    enum RotateMode {
        Tangent = 0,
        Chain = 1,
        ChainScale = 2,
    }
}
declare module spine {
    class Skeleton {
        data: SkeletonData;
        bones: Array<Bone>;
        slots: Array<Slot>;
        drawOrder: Array<Slot>;
        ikConstraints: Array<IkConstraint>;
        ikConstraintsSorted: Array<IkConstraint>;
        transformConstraints: Array<TransformConstraint>;
        pathConstraints: Array<PathConstraint>;
        _updateCache: Updatable[];
        skin: Skin;
        color: Color;
        time: number;
        flipX: boolean;
        flipY: boolean;
        x: number;
        y: number;
        constructor(data: SkeletonData);
        updateCache(): void;
        sortPathConstraintAttachment(skin: Skin, slotIndex: number, slotBone: Bone): void;
        sortPathConstraintAttachmentWith(attachment: Attachment, slotBone: Bone): void;
        sortBone(bone: Bone): void;
        sortReset(bones: Array<Bone>): void;
        updateWorldTransform(): void;
        setToSetupPose(): void;
        setBonesToSetupPose(): void;
        setSlotsToSetupPose(): void;
        getRootBone(): Bone;
        findBone(boneName: string): Bone;
        findBoneIndex(boneName: string): number;
        findSlot(slotName: string): Slot;
        findSlotIndex(slotName: string): number;
        setSkinByName(skinName: string): void;
        setSkin(newSkin: Skin): void;
        getAttachmentByName(slotName: string, attachmentName: string): Attachment;
        getAttachment(slotIndex: number, attachmentName: string): Attachment;
        setAttachment(slotName: string, attachmentName: string): void;
        findIkConstraint(constraintName: string): IkConstraint;
        findTransformConstraint(constraintName: string): TransformConstraint;
        findPathConstraint(constraintName: string): PathConstraint;
        getBounds(offset: Vector2, size: Vector2): void;
        update(delta: number): void;
    }
}
declare module spine {
    class SkeletonBounds {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
        boundingBoxes: BoundingBoxAttachment[];
        polygons: ArrayLike<number>[];
        private polygonPool;
        update(skeleton: Skeleton, updateAabb: boolean): void;
        aabbCompute(): void;
        aabbContainsPoint(x: number, y: number): boolean;
        aabbIntersectsSegment(x1: number, y1: number, x2: number, y2: number): boolean;
        aabbIntersectsSkeleton(bounds: SkeletonBounds): boolean;
        containsPoint(x: number, y: number): BoundingBoxAttachment;
        containsPointPolygon(polygon: ArrayLike<number>, x: number, y: number): boolean;
        intersectsSegment(x1: number, y1: number, x2: number, y2: number): BoundingBoxAttachment;
        intersectsSegmentPolygon(polygon: ArrayLike<number>, x1: number, y1: number, x2: number, y2: number): boolean;
        getPolygon(boundingBox: BoundingBoxAttachment): ArrayLike<number>;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module spine {
    class SkeletonData {
        name: string;
        bones: BoneData[];
        slots: SlotData[];
        skins: Skin[];
        defaultSkin: Skin;
        events: EventData[];
        animations: Animation[];
        ikConstraints: IkConstraintData[];
        transformConstraints: TransformConstraintData[];
        pathConstraints: PathConstraintData[];
        width: number;
        height: number;
        version: string;
        hash: string;
        imagesPath: string;
        findBone(boneName: string): BoneData;
        findBoneIndex(boneName: string): number;
        findSlot(slotName: string): SlotData;
        findSlotIndex(slotName: string): number;
        findSkin(skinName: string): Skin;
        findEvent(eventDataName: string): EventData;
        findAnimation(animationName: string): Animation;
        findIkConstraint(constraintName: string): IkConstraintData;
        findTransformConstraint(constraintName: string): TransformConstraintData;
        findPathConstraint(constraintName: string): PathConstraintData;
        findPathConstraintIndex(pathConstraintName: string): number;
    }
}
declare module spine {
    class SkeletonJson {
        attachmentLoader: AttachmentLoader;
        scale: number;
        private linkedMeshes;
        constructor(attachmentLoader: AttachmentLoader);
        readSkeletonData(json: string): SkeletonData;
        readAttachment(map: any, skin: Skin, slotIndex: number, name: string): Attachment;
        readVertices(map: any, attachment: VertexAttachment, verticesLength: number): void;
        readAnimation(map: any, name: string, skeletonData: SkeletonData): void;
        readCurve(map: any, timeline: CurveTimeline, frameIndex: number): void;
        getValue(map: any, prop: string, defaultValue: any): any;
        static blendModeFromString(str: string): BlendMode;
        static positionModeFromString(str: string): PositionMode;
        static spacingModeFromString(str: string): SpacingMode;
        static rotateModeFromString(str: string): RotateMode;
    }
}
declare module spine {
    class Skin {
        name: string;
        attachments: Map<Attachment>[];
        constructor(name: string);
        addAttachment(slotIndex: number, name: string, attachment: Attachment): void;
        getAttachment(slotIndex: number, name: string): Attachment;
        attachAll(skeleton: Skeleton, oldSkin: Skin): void;
    }
}
declare module spine {
    class Slot {
        data: SlotData;
        bone: Bone;
        color: Color;
        private attachment;
        private attachmentTime;
        attachmentVertices: number[];
        constructor(data: SlotData, bone: Bone);
        getAttachment(): Attachment;
        setAttachment(attachment: Attachment): void;
        setAttachmentTime(time: number): void;
        getAttachmentTime(): number;
        setToSetupPose(): void;
    }
}
declare module spine {
    class SlotData {
        index: number;
        name: string;
        boneData: BoneData;
        color: Color;
        attachmentName: string;
        blendMode: BlendMode;
        constructor(index: number, name: string, boneData: BoneData);
    }
}
declare module spine {
    class TextureAtlas implements Disposable {
        pages: TextureAtlasPage[];
        regions: TextureAtlasRegion[];
        constructor(atlasText: string, textureLoader: (path: string) => any);
        private load(atlasText, textureLoader);
        findRegion(name: string): TextureAtlasRegion;
        dispose(): void;
    }
    class TextureAtlasPage {
        name: string;
        minFilter: TextureFilter;
        magFilter: TextureFilter;
        uWrap: TextureWrap;
        vWrap: TextureWrap;
        texture: Texture;
        width: number;
        height: number;
    }
    class TextureAtlasRegion extends TextureRegion {
        page: TextureAtlasPage;
        name: string;
        x: number;
        y: number;
        index: number;
        rotate: boolean;
        texture: Texture;
    }
}
declare module spine {
    class TextureAtlasAttachmentLoader implements AttachmentLoader {
        atlas: TextureAtlas;
        constructor(atlas: TextureAtlas);
        newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
        newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
        newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
        newPathAttachment(skin: Skin, name: string): PathAttachment;
    }
}
declare module spine {
    class TransformConstraint implements Updatable {
        data: TransformConstraintData;
        bones: Array<Bone>;
        target: Bone;
        rotateMix: number;
        translateMix: number;
        scaleMix: number;
        shearMix: number;
        temp: Vector2;
        constructor(data: TransformConstraintData, skeleton: Skeleton);
        apply(): void;
        update(): void;
    }
}
declare module spine {
    class TransformConstraintData {
        name: string;
        bones: BoneData[];
        target: BoneData;
        rotateMix: number;
        translateMix: number;
        scaleMix: number;
        shearMix: number;
        offsetRotation: number;
        offsetX: number;
        offsetY: number;
        offsetScaleX: number;
        offsetScaleY: number;
        offsetShearY: number;
        constructor(name: string);
    }
}
declare module spine {
    interface Updatable {
        update(): void;
    }
}
declare module spine {
    interface Map<T> {
        [key: string]: T;
    }
    interface Disposable {
        dispose(): void;
    }
    class Color {
        r: number;
        g: number;
        b: number;
        a: number;
        static WHITE: Color;
        static RED: Color;
        static GREEN: Color;
        static BLUE: Color;
        static MAGENTA: Color;
        constructor(r?: number, g?: number, b?: number, a?: number);
        set(r: number, g: number, b: number, a: number): void;
        setFromColor(c: Color): void;
        setFromString(hex: string): void;
        add(r: number, g: number, b: number, a: number): void;
        clamp(): this;
    }
    class MathUtils {
        static PI: number;
        static PI2: number;
        static radiansToDegrees: number;
        static radDeg: number;
        static degreesToRadians: number;
        static degRad: number;
        static clamp(value: number, min: number, max: number): number;
        static cosDeg(degrees: number): number;
        static sinDeg(degrees: number): number;
        static signum(value: number): number;
        static toInt(x: number): number;
        static cbrt(x: number): number;
    }
    class Utils {
        static SUPPORTS_TYPED_ARRAYS: boolean;
        static arrayCopy<T>(source: ArrayLike<T>, sourceStart: number, dest: ArrayLike<T>, destStart: number, numElements: number): void;
        static setArraySize<T>(array: Array<T>, size: number, value?: any): Array<T>;
        static newArray<T>(size: number, defaultValue: T): Array<T>;
        static newFloatArray(size: number): ArrayLike<number>;
        static toFloatArray(array: Array<number>): Float32Array | number[];
    }
    class DebugUtils {
        static logBones(skeleton: Skeleton): void;
    }
    class Pool<T> {
        private items;
        private instantiator;
        constructor(instantiator: () => T);
        obtain(): T;
        free(item: T): void;
        freeAll(items: ArrayLike<T>): void;
        clear(): void;
    }
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        set(x: number, y: number): Vector2;
        length(): number;
        normalize(): this;
    }
}
declare module spine {
    abstract class Attachment {
        name: string;
        constructor(name: string);
    }
    abstract class VertexAttachment extends Attachment {
        bones: Array<number>;
        vertices: ArrayLike<number>;
        worldVerticesLength: number;
        constructor(name: string);
        computeWorldVertices(slot: Slot, worldVertices: ArrayLike<number>): void;
        computeWorldVerticesWith(slot: Slot, start: number, count: number, worldVertices: ArrayLike<number>, offset: number): void;
        applyDeform(sourceAttachment: VertexAttachment): boolean;
    }
}
declare module spine {
    interface AttachmentLoader {
        newRegionAttachment(skin: Skin, name: string, path: string): RegionAttachment;
        newMeshAttachment(skin: Skin, name: string, path: string): MeshAttachment;
        newBoundingBoxAttachment(skin: Skin, name: string): BoundingBoxAttachment;
        newPathAttachment(skin: Skin, name: string): PathAttachment;
    }
}
declare module spine {
    enum AttachmentType {
        Region = 0,
        BoundingBox = 1,
        Mesh = 2,
        LinkedMesh = 3,
        Path = 4,
    }
}
declare module spine {
    class BoundingBoxAttachment extends VertexAttachment {
        color: Color;
        constructor(name: string);
    }
}
declare module spine {
    class MeshAttachment extends VertexAttachment {
        region: TextureRegion;
        path: string;
        regionUVs: ArrayLike<number>;
        worldVertices: ArrayLike<number>;
        triangles: Array<number>;
        color: Color;
        hullLength: number;
        private parentMesh;
        inheritDeform: boolean;
        tempColor: Color;
        constructor(name: string);
        updateUVs(): void;
        updateWorldVertices(slot: Slot, premultipliedAlpha: boolean): ArrayLike<number>;
        applyDeform(sourceAttachment: VertexAttachment): boolean;
        getParentMesh(): MeshAttachment;
        setParentMesh(parentMesh: MeshAttachment): void;
    }
}
declare module spine {
    class PathAttachment extends VertexAttachment {
        lengths: Array<number>;
        closed: boolean;
        constantSpeed: boolean;
        color: Color;
        constructor(name: string);
    }
}
declare module spine {
    class RegionAttachment extends Attachment {
        static OX1: number;
        static OY1: number;
        static OX2: number;
        static OY2: number;
        static OX3: number;
        static OY3: number;
        static OX4: number;
        static OY4: number;
        static X1: number;
        static Y1: number;
        static C1R: number;
        static C1G: number;
        static C1B: number;
        static C1A: number;
        static U1: number;
        static V1: number;
        static X2: number;
        static Y2: number;
        static C2R: number;
        static C2G: number;
        static C2B: number;
        static C2A: number;
        static U2: number;
        static V2: number;
        static X3: number;
        static Y3: number;
        static C3R: number;
        static C3G: number;
        static C3B: number;
        static C3A: number;
        static U3: number;
        static V3: number;
        static X4: number;
        static Y4: number;
        static C4R: number;
        static C4G: number;
        static C4B: number;
        static C4A: number;
        static U4: number;
        static V4: number;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotation: number;
        width: number;
        height: number;
        color: Color;
        path: string;
        rendererObject: any;
        region: TextureRegion;
        offset: ArrayLike<number>;
        vertices: ArrayLike<number>;
        tempColor: Color;
        constructor(name: string);
        setRegion(region: TextureRegion): void;
        updateOffset(): void;
        updateWorldVertices(slot: Slot, premultipliedAlpha: boolean): ArrayLike<number>;
    }
}
declare module spine.threejs {
    class AssetManager extends spine.AssetManager {
        constructor(pathPrefix?: string);
    }
}
declare module spine.threejs {
    class MeshBatcher {
        mesh: THREE.Mesh;
        private static VERTEX_SIZE;
        private vertexBuffer;
        private vertices;
        private verticesLength;
        private indices;
        private indicesLength;
        constructor(mesh: THREE.Mesh, maxVertices?: number);
        begin(): void;
        batch(vertices: ArrayLike<number>, indices: ArrayLike<number>, z?: number): void;
        end(): void;
    }
}
declare module spine.threejs {
    class SkeletonMesh extends THREE.Mesh {
        skeleton: Skeleton;
        state: AnimationState;
        zOffset: number;
        private batcher;
        static QUAD_TRIANGLES: number[];
        constructor(skeletonData: SkeletonData);
        update(deltaTime: number): void;
        private updateGeometry();
        static createMesh(map: THREE.Texture): THREE.Mesh;
    }
}
declare module spine.threejs {
    class ThreeJsTexture extends Texture {
        texture: THREE.Texture;
        constructor(image: HTMLImageElement);
        setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        dispose(): void;
        static toThreeJsTextureFilter(filter: TextureFilter): THREE.TextureFilter;
        static toThreeJsTextureWrap(wrap: TextureWrap): THREE.Wrapping;
    }
}
declare module spine.webgl {
    class AssetManager extends spine.AssetManager {
        constructor(gl: WebGLRenderingContext, pathPrefix?: string);
    }
}
declare module spine.webgl {
    class OrthoCamera {
        position: Vector3;
        direction: Vector3;
        up: Vector3;
        near: number;
        far: number;
        zoom: number;
        viewportWidth: number;
        viewportHeight: number;
        projectionView: Matrix4;
        inverseProjectionView: Matrix4;
        projection: Matrix4;
        view: Matrix4;
        private tmp;
        constructor(viewportWidth: number, viewportHeight: number);
        update(): void;
        screenToWorld(screenCoords: Vector3, screenWidth: number, screenHeight: number): Vector3;
        setViewport(viewportWidth: number, viewportHeight: number): void;
    }
}
declare module spine.webgl {
    class GLTexture extends Texture implements Disposable {
        private gl;
        private texture;
        private boundUnit;
        constructor(gl: WebGLRenderingContext, image: HTMLImageElement, useMipMaps?: boolean);
        setFilters(minFilter: TextureFilter, magFilter: TextureFilter): void;
        setWraps(uWrap: TextureWrap, vWrap: TextureWrap): void;
        update(useMipMaps: boolean): void;
        bind(unit?: number): void;
        unbind(): void;
        dispose(): void;
    }
}
declare module spine.webgl {
    class Input {
        element: HTMLElement;
        lastX: number;
        lastY: number;
        buttonDown: boolean;
        currTouch: Touch;
        touchesPool: Pool<Touch>;
        private listeners;
        constructor(element: HTMLElement);
        private setupCallbacks(element);
        addListener(listener: InputListener): void;
        removeListener(listener: InputListener): void;
    }
    class Touch {
        identifier: number;
        x: number;
        y: number;
        constructor(identifier: number, x: number, y: number);
    }
    interface InputListener {
        down(x: number, y: number): void;
        up(x: number, y: number): void;
        moved(x: number, y: number): void;
        dragged(x: number, y: number): void;
    }
}
declare module spine.webgl {
    const M00: number;
    const M01: number;
    const M02: number;
    const M03: number;
    const M10: number;
    const M11: number;
    const M12: number;
    const M13: number;
    const M20: number;
    const M21: number;
    const M22: number;
    const M23: number;
    const M30: number;
    const M31: number;
    const M32: number;
    const M33: number;
    class Matrix4 {
        temp: Float32Array;
        values: Float32Array;
        private static xAxis;
        private static yAxis;
        private static zAxis;
        private static tmpMatrix;
        constructor();
        set(values: ArrayLike<number>): Matrix4;
        transpose(): Matrix4;
        identity(): Matrix4;
        invert(): Matrix4;
        determinant(): number;
        translate(x: number, y: number, z: number): Matrix4;
        copy(): Matrix4;
        projection(near: number, far: number, fovy: number, aspectRatio: number): Matrix4;
        ortho2d(x: number, y: number, width: number, height: number): Matrix4;
        ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
        multiply(matrix: Matrix4): Matrix4;
        multiplyLeft(matrix: Matrix4): Matrix4;
        lookAt(position: Vector3, direction: Vector3, up: Vector3): this;
        static initTemps(): void;
    }
}
declare module spine.webgl {
    class Mesh implements Disposable {
        private attributes;
        private gl;
        private vertices;
        private verticesBuffer;
        private verticesLength;
        private dirtyVertices;
        private indices;
        private indicesBuffer;
        private indicesLength;
        private dirtyIndices;
        private elementsPerVertex;
        getAttributes(): VertexAttribute[];
        maxVertices(): number;
        numVertices(): number;
        setVerticesLength(length: number): void;
        getVertices(): Float32Array;
        maxIndices(): number;
        numIndices(): number;
        setIndicesLength(length: number): void;
        getIndices(): Uint16Array;
        constructor(gl: WebGLRenderingContext, attributes: VertexAttribute[], maxVertices: number, maxIndices: number);
        setVertices(vertices: Array<number>): void;
        setIndices(indices: Array<number>): void;
        draw(shader: Shader, primitiveType: number): void;
        drawWithOffset(shader: Shader, primitiveType: number, offset: number, count: number): void;
        bind(shader: Shader): void;
        unbind(shader: Shader): void;
        private update();
        dispose(): void;
    }
    class VertexAttribute {
        name: string;
        type: VertexAttributeType;
        numElements: number;
        constructor(name: string, type: VertexAttributeType, numElements: number);
    }
    class Position2Attribute extends VertexAttribute {
        constructor();
    }
    class Position3Attribute extends VertexAttribute {
        constructor();
    }
    class TexCoordAttribute extends VertexAttribute {
        constructor(unit?: number);
    }
    class ColorAttribute extends VertexAttribute {
        constructor();
    }
    enum VertexAttributeType {
        Float = 0,
    }
}
declare module spine.webgl {
    class PolygonBatcher implements Disposable {
        private gl;
        private drawCalls;
        private isDrawing;
        private mesh;
        private shader;
        private lastTexture;
        private verticesLength;
        private indicesLength;
        private srcBlend;
        private dstBlend;
        constructor(gl: WebGLRenderingContext, maxVertices?: number);
        begin(shader: Shader): void;
        setBlendMode(srcBlend: number, dstBlend: number): void;
        draw(texture: GLTexture, vertices: ArrayLike<number>, indices: Array<number>): void;
        private flush();
        end(): void;
        getDrawCalls(): number;
        dispose(): void;
    }
}
declare module spine.webgl {
    class SceneRenderer implements Disposable {
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
        camera: OrthoCamera;
        private batcherShader;
        private batcher;
        private shapes;
        private shapesShader;
        private activeRenderer;
        private skeletonRenderer;
        private skeletonDebugRenderer;
        private QUAD;
        private QUAD_TRIANGLES;
        private WHITE;
        constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext);
        begin(): void;
        drawSkeleton(skeleton: Skeleton, premultipliedAlpha?: boolean): void;
        drawSkeletonDebug(skeleton: Skeleton, premultipliedAlpha?: boolean, ignoredBones?: Array<string>): void;
        drawTexture(texture: GLTexture, x: number, y: number, width: number, height: number, color?: Color): void;
        drawRegion(region: TextureAtlasRegion, x: number, y: number, width: number, height: number, color?: Color): void;
        line(x: number, y: number, x2: number, y2: number, color?: Color, color2?: Color): void;
        triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
        quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
        rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
        rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
        polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
        circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
        curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
        end(): void;
        resize(resizeMode: ResizeMode): void;
        private enableRenderer(renderer);
        dispose(): void;
    }
    enum ResizeMode {
        Stretch = 0,
        Expand = 1,
        Fit = 2,
    }
}
declare module spine.webgl {
    class Shader implements Disposable {
        private vertexShader;
        private fragmentShader;
        static MVP_MATRIX: string;
        static POSITION: string;
        static COLOR: string;
        static TEXCOORDS: string;
        static SAMPLER: string;
        private gl;
        private vs;
        private fs;
        private program;
        private tmp2x2;
        private tmp3x3;
        private tmp4x4;
        getProgram(): WebGLProgram;
        getVertexShader(): string;
        getFragmentShader(): string;
        constructor(gl: WebGLRenderingContext, vertexShader: string, fragmentShader: string);
        private compile();
        private compileShader(type, source);
        private compileProgram(vs, fs);
        bind(): void;
        unbind(): void;
        setUniformi(uniform: string, value: number): void;
        setUniformf(uniform: string, value: number): void;
        setUniform2f(uniform: string, value: number, value2: number): void;
        setUniform3f(uniform: string, value: number, value2: number, value3: number): void;
        setUniform4f(uniform: string, value: number, value2: number, value3: number, value4: number): void;
        setUniform2x2f(uniform: string, value: ArrayLike<number>): void;
        setUniform3x3f(uniform: string, value: ArrayLike<number>): void;
        setUniform4x4f(uniform: string, value: ArrayLike<number>): void;
        getUniformLocation(uniform: string): WebGLUniformLocation;
        getAttributeLocation(attribute: string): number;
        dispose(): void;
        static newColoredTextured(gl: WebGLRenderingContext): Shader;
        static newColored(gl: WebGLRenderingContext): Shader;
    }
}
declare module spine.webgl {
    class ShapeRenderer implements Disposable {
        private gl;
        private isDrawing;
        private mesh;
        private shapeType;
        private color;
        private shader;
        private vertexIndex;
        private tmp;
        private srcBlend;
        private dstBlend;
        constructor(gl: WebGLRenderingContext, maxVertices?: number);
        begin(shader: Shader): void;
        setBlendMode(srcBlend: number, dstBlend: number): void;
        setColor(color: Color): void;
        setColorWith(r: number, g: number, b: number, a: number): void;
        point(x: number, y: number, color?: Color): void;
        line(x: number, y: number, x2: number, y2: number, color?: Color): void;
        triangle(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, color?: Color, color2?: Color, color3?: Color): void;
        quad(filled: boolean, x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, color?: Color, color2?: Color, color3?: Color, color4?: Color): void;
        rect(filled: boolean, x: number, y: number, width: number, height: number, color?: Color): void;
        rectLine(filled: boolean, x1: number, y1: number, x2: number, y2: number, width: number, color?: Color): void;
        x(x: number, y: number, size: number): void;
        polygon(polygonVertices: ArrayLike<number>, offset: number, count: number, color?: Color): void;
        circle(filled: boolean, x: number, y: number, radius: number, color?: Color, segments?: number): void;
        curve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color?: Color): void;
        private vertex(x, y, color);
        end(): void;
        private flush();
        private check(shapeType, numVertices);
        dispose(): void;
    }
    enum ShapeType {
        Point,
        Line,
        Filled,
    }
}
declare module spine.webgl {
    class SkeletonDebugRenderer implements Disposable {
        boneLineColor: Color;
        boneOriginColor: Color;
        attachmentLineColor: Color;
        triangleLineColor: Color;
        aabbColor: Color;
        drawBones: boolean;
        drawRegionAttachments: boolean;
        drawBoundingBoxes: boolean;
        drawMeshHull: boolean;
        drawMeshTriangles: boolean;
        drawPaths: boolean;
        drawSkeletonXY: boolean;
        premultipliedAlpha: boolean;
        scale: number;
        boneWidth: number;
        private gl;
        private bounds;
        private temp;
        private static LIGHT_GRAY;
        private static GREEN;
        constructor(gl: WebGLRenderingContext);
        draw(shapes: ShapeRenderer, skeleton: Skeleton, ignoredBones?: Array<string>): void;
        dispose(): void;
    }
}
declare module spine.webgl {
    class SkeletonRenderer {
        static QUAD_TRIANGLES: number[];
        premultipliedAlpha: boolean;
        private gl;
        constructor(gl: WebGLRenderingContext);
        draw(batcher: PolygonBatcher, skeleton: Skeleton): void;
    }
}
declare module spine.webgl {
    class Vector3 {
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        setFrom(v: Vector3): Vector3;
        set(x: number, y: number, z: number): Vector3;
        add(v: Vector3): Vector3;
        sub(v: Vector3): Vector3;
        scale(s: number): Vector3;
        normalize(): Vector3;
        cross(v: Vector3): Vector3;
        multiply(matrix: Matrix4): Vector3;
        project(matrix: Matrix4): Vector3;
        dot(v: Vector3): number;
        length(): number;
        distance(v: Vector3): number;
    }
}
declare module spine.webgl {
    function getSourceGLBlendMode(gl: WebGLRenderingContext, blendMode: BlendMode, premultipliedAlpha?: boolean): number;
    function getDestGLBlendMode(gl: WebGLRenderingContext, blendMode: BlendMode): number;
}
declare module spine {
    class SpineWidget {
        skeleton: Skeleton;
        state: AnimationState;
        gl: WebGLRenderingContext;
        canvas: HTMLCanvasElement;
        debugRenderer: spine.webgl.SkeletonDebugRenderer;
        private config;
        private assetManager;
        private shader;
        private batcher;
        private shapes;
        private debugShader;
        private mvp;
        private skeletonRenderer;
        private paused;
        private lastFrameTime;
        private backgroundColor;
        private loaded;
        private bounds;
        constructor(element: HTMLElement | string, config: SpineWidgetConfig);
        private validateConfig(config);
        private load();
        private render();
        private resize();
        pause(): void;
        play(): void;
        isPlaying(): boolean;
        setAnimation(animationName: string): void;
        static loadWidgets(): void;
        static loadWidget(widget: HTMLElement): void;
        static pageLoaded: boolean;
        private static ready();
        static setupDOMListener(): void;
    }
    class SpineWidgetConfig {
        json: string;
        atlas: string;
        animation: string;
        imagesPath: string;
        skin: string;
        loop: boolean;
        scale: number;
        x: number;
        y: number;
        fitToCanvas: boolean;
        backgroundColor: string;
        premultipliedAlpha: boolean;
        debug: boolean;
        success: (widget: SpineWidget) => void;
        error: (widget: SpineWidget, msg: string) => void;
    }
}
