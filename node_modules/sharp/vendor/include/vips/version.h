/* Macros for the header version.
 */

#ifndef VIPS_VERSION_H
#define VIPS_VERSION_H

#define VIPS_VERSION		"8.8.1"
#define VIPS_VERSION_STRING	"8.8.1-Sun Jul  7 10:04:59 UTC 2019"
#define VIPS_MAJOR_VERSION	(8)
#define VIPS_MINOR_VERSION	(8)
#define VIPS_MICRO_VERSION	(1)

/* The ABI version, as used for library versioning.
 */
#define VIPS_LIBRARY_CURRENT	(53)
#define VIPS_LIBRARY_REVISION	(0)
#define VIPS_LIBRARY_AGE	(11)

/** 
 * VIPS_SONAME:
 *
 * The name of the shared object containing the vips library, for example
 * "libvips.so.42", or "libvips-42.dll".
 */

#include "soname.h"

/* Not really anything to do with versions, but this is a handy place to put
 * it.
 */
#define VIPS_EXEEXT ""
#define VIPS_ENABLE_DEPRECATED 1

#endif /*VIPS_VERSION_H*/
